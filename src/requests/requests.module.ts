import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

import { NotificationsModule } from '../notifications/notifications.module';
import { Planet } from '../planets/entities/planet.entity';
import { PlanetsModule } from '../planets/planets.module';
import { Request } from './entities/request.entity';
import { RequestsResolver } from './requests.resolver';
import { RequestsService } from './requests.service';
import { PubSubModule } from '../pub-sub/pub-sub.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, Planet, User]),
    NotificationsModule,
    PlanetsModule,
    PubSubModule,
  ],
  providers: [RequestsResolver, RequestsService],
})
export class RequestsModule {}
