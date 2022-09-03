import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserInputError } from 'apollo-server-express';

import { NotificationsService } from '../notifications/notifications.service';
import { Planet } from '../planets/entities/planet.entity';
import { UserRole } from '../planets/entities/user-role';
import { UsersPlanetsService } from '../planets/services/users-planets.service';
import { Request } from './entities/request.entity';
import { RequestInput } from './inputes/request.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
    @InjectRepository(Planet)
    private readonly planetRepo: Repository<Planet>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly notificationsService: NotificationsService,
    private readonly usersPlanetsService: UsersPlanetsService,
  ) {}

  async getRequests(user: User) {
    const adminPlanets = user.planets.map((planet) => {
      if (planet.role === UserRole.ADMIN) {
        return planet.planetId;
      }
    });

    const myRequest = await this.requestRepo.find({
      where: { userId: user.id },
      order: {
        createdAt: 'DESC',
      },
    });

    const planetsRequests = await this.requestRepo.find({
      where: { planetId: In(adminPlanets) },
      order: {
        createdAt: 'DESC',
      },
    });

    return { users: myRequest, planets: planetsRequests };
  }

  async createRequest(requestInput: RequestInput, user: User) {
    const planet = await this.planetRepo.findOne({
      where: { uuid: requestInput.planetUuid },
      relations: ['users'],
    });
    if (!planet) {
      throw new NotFoundException('Planet not found');
    }

    const asignUser = planet.users.find((u) => u.userId === user.id);
    if (asignUser) {
      throw new BadRequestException('User already belongs to this planet');
    }

    const usersReq = await this.requestRepo.findOneBy({ userId: user.id });
    if (usersReq) {
      throw new UserInputError('You already have sent this request');
    }

    const request = this.requestRepo.create({
      user,
      planet,
      viewed: false,
      content: requestInput.content,
    });

    return this.requestRepo.save(request);
  }

  async markAsSeen(requestUuids: string[], user: User) {
    const data = await this.requestRepo
      .createQueryBuilder()
      .update({ viewed: true })
      .where({ uuid: In(requestUuids), userId: user.id })
      .returning('*')
      .execute();

    return data.raw;
  }

  async resolveRequest(requestUuid: string, rejected: boolean, user: User) {
    const request = await this.requestRepo.findOne({
      where: { uuid: requestUuid, userId: user.id },
      relations: ['planet'],
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (!rejected) {
      this.usersPlanetsService.createRelation(
        user,
        request.planet,
        UserRole.USER,
      );
    }

    this.notificationsService.createNotification(
      user,
      request.planet,
      rejected,
    );

    return this.requestRepo.remove(request);
  }

  getPlanetByUuid(planetId: number) {
    return this.planetRepo.findOneBy({ id: planetId });
  }

  getUserByUuid(userId: number) {
    return this.userRepo.findOneBy({ id: userId });
  }
}
