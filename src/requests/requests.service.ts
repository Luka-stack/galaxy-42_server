import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { Planet } from '../planets/entities/planet.entity';
import { UserRole } from '../planets/entities/user-role';
import { UsersPlanetsService } from '../planets/services/users-planets.service';
import { Repository, In } from 'typeorm';
import { Request } from './entities/request.entity';
import { RequestInput } from './inputes/request.input';
import { User } from '../auth/entities/user.entity';

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

  getRequests(planetuuid?: string, useruuid?: string, viewed?: boolean) {
    return this.requestRepo.find({
      where: { planetuuid, useruuid, viewed },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async createRequest(userUuid: string, requestInput: RequestInput) {
    const planet = await this.planetRepo.findOne({
      where: { uuid: requestInput.planetUuid },
      relations: ['users'],
    });
    if (!planet) {
      throw new NotFoundException('Planet not found');
    }

    const user = await this.userRepo.findOneBy({ uuid: userUuid });

    const asignUser = planet.users.find((u) => u.userId === user.id);
    if (asignUser) {
      throw new BadRequestException('User already belongs to this planet');
    }

    const request = this.requestRepo.create({
      useruuid: userUuid,
      user,
      planet,
      planetuuid: planet.uuid,
      content: requestInput.content,
      viewed: false,
    });

    return this.requestRepo.save(request);
  }

  async markAsSeen(requestUuids: string[]) {
    const data = await this.requestRepo
      .createQueryBuilder()
      .update({ viewed: true })
      .where({ uuid: In(requestUuids) })
      .returning('*')
      .execute();

    return data.raw;
  }

  async resolveRequest(requestUuid: string, rejected: boolean) {
    const request = await this.requestRepo.findOne({
      where: { uuid: requestUuid },
      relations: ['user', 'planet'],
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

    this.notificationsService.createNotification(
      request.user,
      request.planet,
      rejected,
    );

    return this.requestRepo.remove(request);
  }

  getPlanetByUuid(planetUuid: string) {
    return this.planetRepo.findOneBy({ uuid: planetUuid });
  }

  getUserByUuid(UserUuid: string) {
    return this.userRepo.findOneBy({ uuid: UserUuid });
  }
}
