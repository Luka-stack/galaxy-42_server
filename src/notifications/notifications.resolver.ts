import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { PlanetsService } from '../planets/services/planets.service';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './types/notification.type';
import { Notification } from './entities/notification.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../common/decorators/get-user.decorator';
import { PubSub } from 'graphql-subscriptions';
import { JwtSubGuard } from 'src/auth/guards/jwt-sub.guard';

const pubSub = new PubSub();

@Resolver(() => NotificationType)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationsService,
    private readonly planetsService: PlanetsService,
  ) {}

  @Query(() => [NotificationType])
  @UseGuards(JwtAuthGuard)
  getNotifications(@GetUser() user: User) {
    return this.notificationService.getNotifications(user);
  }

  // TODO RETURN LIST OF DELETED NOTIFICATIONS
  @Mutation(() => [NotificationType])
  @UseGuards(JwtAuthGuard)
  deleteNotification(
    @Args({ name: 'notificationUuids', type: () => [String] })
    notificationUuids: string[],
    @GetUser() user: User,
  ) {
    return this.notificationService.deleteNotifications(
      notificationUuids,
      user,
    );
  }

  // TODO RETURN LIST OF MODIFIED NOTIFICATIONS
  @Mutation(() => [NotificationType])
  @UseGuards(JwtAuthGuard)
  notificationsViewed(
    @Args({ name: 'notificationUuids', type: () => [String] })
    notificationUuids: string[],
    @GetUser() user: User,
  ) {
    return this.notificationService.markAsSeen(notificationUuids, user);
  }

  @Subscription(() => String, {
    resolve: (value) => value,
  })
  @UseGuards(JwtAuthGuard)
  notificationCreated(@GetUser() user: User) {
    console.log('User Subscribed', user.username);

    return pubSub.asyncIterator('notificationCreated');
  }

  @Mutation(() => Boolean)
  testSub() {
    pubSub.publish('notificationCreated', 'Subscription Is Working');

    return true;
  }

  @ResolveField()
  async planet(@Parent() notification: Notification) {
    return this.planetsService.getPlanetById(notification.planetId);
  }
}
