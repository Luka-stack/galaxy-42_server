import {
  BadRequestException,
  Inject,
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
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class RequestsService {
  @Inject('PUB_SUB')
  private pubSub: PubSub;

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

    let alreadyBelongs = false;
    let adminUserId;

    for (const u of planet.users) {
      if (u.userId === user.id) {
        alreadyBelongs = true;
        continue;
      }

      if (u.role === UserRole.ADMIN) {
        adminUserId = u.userId;
      }
    }

    if (alreadyBelongs) {
      throw new BadRequestException('User already belongs to this planet');
    }

    const usersReq = await this.requestRepo.findOneBy({
      userId: user.id,
      planetId: planet.id,
    });
    if (usersReq) {
      throw new UserInputError('You already have sent this request');
    }

    const request = this.requestRepo.create({
      user,
      planet,
      viewed: false,
      content: requestInput.content,
    });

    const savedEntity = await this.requestRepo.save(request);
    this.pubSub.publish('requestCreated', {
      request: savedEntity,
      admin: adminUserId,
    });

    return savedEntity;
  }

  // TODO add check for admin user
  async markAsSeen(requestUuids: string[], user: User) {
    const data = await this.requestRepo
      .createQueryBuilder()
      .update({ viewed: true })
      .where({ uuid: In(requestUuids) })
      .returning('*')
      .execute();

    return data.raw;
  }

  // TODO add check for admin user
  async resolveRequest(requestUuid: string, rejected: boolean, user: User) {
    const request = await this.requestRepo.findOne({
      where: { uuid: requestUuid },
      relations: ['planet', 'user'],
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (!rejected) {
      this.usersPlanetsService.createRelation(
        request.user,
        request.planet,
        UserRole.USER,
      );
    }

    this.requestRepo.remove(request);

    this.notificationsService.createNotification(
      request.user,
      request.planet,
      rejected,
    );

    return request.uuid;
  }

  requestCreatedSub() {
    return this.pubSub.asyncIterator('requestCreated');
  }

  getPlanetByUuid(planetId: number) {
    return this.planetRepo.findOneBy({ id: planetId });
  }

  getUserByUuid(userId: number) {
    return this.userRepo.findOneBy({ id: userId });
  }
}
