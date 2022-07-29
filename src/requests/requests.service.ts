import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserRole } from 'src/planets/entities/user-role';
import { UsersPlanetsService } from 'src/planets/services/users-planets.service';
import { Repository, In } from 'typeorm';
import { Request } from './entities/request.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
    private readonly notificationsService: NotificationsService,
    private readonly usersPlanetsService: UsersPlanetsService,
  ) {}

  getRequests(userId?: string, planetId?: string, viewed?: boolean) {
    return this.requestRepo.find({
      where: { userId, planetId, viewed },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async markAsSeen(requestIds: string[]) {
    const data = await this.requestRepo
      .createQueryBuilder()
      .update({ viewed: true })
      .where({ uuid: In(requestIds) })
      .returning('*')
      .execute();

    return data.raw;
  }

  async resolveRequest(requestId: string, rejected: boolean) {
    const request = await this.requestRepo.findOne({
      where: { uuid: requestId },
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
}
