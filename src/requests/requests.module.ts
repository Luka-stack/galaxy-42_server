import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { Planet } from '../planets/entities/planet.entity';
import { PlanetsModule } from '../planets/planets.module';
import { Request } from './entities/request.entity';
import { RequestsResolver } from './requests.resolver';
import { RequestsService } from './requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, Planet, User]),
    NotificationsModule,
    PlanetsModule,
  ],
  providers: [RequestsResolver, RequestsService],
})
export class RequestsModule {}
