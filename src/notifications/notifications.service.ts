import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';

import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { Planet } from '../planets/entities/planet.entity';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class NotificationsService {
  @Inject('PUB_SUB')
  private pubSub: PubSub;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  getNotifications(user: User) {
    return this.notificationRepo.find({
      where: { userId: user.id },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async deleteNotifications(notificationUuids: string[], user: User) {
    const notifications = await this.notificationRepo.findBy({
      uuid: In(notificationUuids),
      userId: user.id,
    });

    return this.notificationRepo.remove(notifications);
  }

  async markAsSeen(notificationUuids: string[], user) {
    const data = await this.notificationRepo
      .createQueryBuilder()
      .update({ viewed: true })
      .where({ uuid: In(notificationUuids), userId: user.id })
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

    const readyNotification = await this.notificationRepo.save(notification);
    this.pubSub.publish('notificationCreated', readyNotification);
  }

  notificationCreatedSub() {
    return this.pubSub.asyncIterator('notificationCreated');
  }

  sendTestNot() {
    this.pubSub.publish('notificationCreated', 'Subscription Is Working');

    return true;
  }
}
