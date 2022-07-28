import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../auth/services/user.service';
import { Notification } from './entities/notification.entity';
import { Repository, In } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  getNotifications(rejected?: boolean, viewed?: boolean) {
    return this.notificationRepo.find({
      where: { rejected, viewed },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async deleteNotification(notificationIds: string[]) {
    const notifications = await this.notificationRepo.findBy({
      uuid: In(notificationIds),
    });

    return this.notificationRepo.remove(notifications);
  }

  async markAsSeen(notificationIds: string[]) {
    const data = await this.notificationRepo
      .createQueryBuilder()
      .update({ viewed: true })
      .where({ uuid: In(notificationIds) })
      .returning('*')
      .execute();

    return data.raw;
  }

  async createNotification(userId: string) {
    const user = await this.userService.findUserById(userId);

    const notification = this.notificationRepo.create({
      user,
      content: 'Test content',
      planetId: 'PLANET_UUID',
      rejected: Math.random() > 0.5,
      viewed: Math.random() > 0.5,
    });

    return this.notificationRepo.save(notification);
  }
}
