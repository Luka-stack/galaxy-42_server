import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QueryNotificationsInput } from './inputs/query-notifications.input';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './types/notification.type';

@Resolver((of) => NotificationType)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationsService) {}

  @Query((returns) => [NotificationType])
  getNotifications(
    @Args('rejected', { nullable: true }) rejected?: boolean,
    @Args('viewed', { nullable: true }) viewed?: boolean,
  ) {
    return this.notificationService.getNotifications(rejected, viewed);
  }

  @Mutation((returns) => NotificationType)
  createNotification(@Args('userId') userId: string) {
    return this.notificationService.createNotification(userId);
  }

  @Mutation((returns) => [NotificationType])
  deleteNotification(
    @Args({ name: 'notificationIds', type: () => [String] })
    notificationIds: string[],
  ) {
    return this.notificationService.deleteNotification(notificationIds);
  }

  @Mutation((returns) => [NotificationType])
  markAsSeen(
    @Args({ name: 'notificationIds', type: () => [String] })
    notificationIds: string[],
  ) {
    return this.notificationService.markAsSeen(notificationIds);
  }
}
