import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository, In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { Planet } from 'src/planets/entities/planet.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  getNotifications(rejected?: boolean, viewed?: boolean) {
    return this.notificationRepo.find({
      where: { rejected, viewed },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async deleteNotifications(notificationUuids: string[]) {
    const notifications = await this.notificationRepo.findBy({
      uuid: In(notificationUuids),
    });

    return this.notificationRepo.remove(notifications);
  }

  async markAsSeen(notificationUuids: string[]) {
    const data = await this.notificationRepo
      .createQueryBuilder()
      .update({ viewed: true })
      .where({ uuid: In(notificationUuids) })
      .returning('*')
      .execute();

    return data.raw;
  }

  async createNotification(user: User, planet: Planet, rejected: boolean) {
    const notification = this.notificationRepo.create({
      user,
      planet,
      rejected,
      viewed: false,
    });

    this.notificationRepo.save(notification);
  }
}
