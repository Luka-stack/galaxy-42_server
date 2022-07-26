import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PubSubModule } from '../pub-sub/pub-sub.module';
import { PlanetsModule } from '../planets/planets.module';
import { Notification } from './entities/notification.entity';
import { NotificationResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    PlanetsModule,
    PubSubModule,
  ],
  providers: [NotificationsService, NotificationResolver],
  exports: [NotificationsService],
})
export class NotificationsModule {}
