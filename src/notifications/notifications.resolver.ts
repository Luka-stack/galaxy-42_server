import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PlanetsService } from 'src/planets/services/planets.service';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './types/notification.type';
import { Notification } from './entities/notification.entity';

@Resolver((of) => NotificationType)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationsService,
    private readonly planetsService: PlanetsService,
  ) {}

  @Query((returns) => [NotificationType])
  getNotifications(
    @Args('rejected', { nullable: true }) rejected?: boolean,
    @Args('viewed', { nullable: true }) viewed?: boolean,
  ) {
    return this.notificationService.getNotifications(rejected, viewed);
  }

  @Mutation((returns) => [NotificationType])
  deleteNotification(
    @Args({ name: 'notificationUuids', type: () => [String] })
    notificationUuids: string[],
  ) {
    return this.notificationService.deleteNotifications(notificationUuids);
  }

  @Mutation((returns) => [NotificationType])
  notificationsViewed(
    @Args({ name: 'notificationUuids', type: () => [String] })
    notificationUuids: string[],
  ) {
    return this.notificationService.markAsSeen(notificationUuids);
  }

  @ResolveField()
  async planet(@Parent() notification: Notification) {
    return this.planetsService.getPlanetById(notification.planetId);
  }
}
