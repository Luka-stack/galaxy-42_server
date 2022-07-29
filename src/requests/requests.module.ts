import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PlanetsModule } from 'src/planets/planets.module';
import { Request } from './entities/request.entity';
import { RequestsResolver } from './requests.resolver';
import { RequestsService } from './requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
    NotificationsModule,
    PlanetsModule,
  ],
  providers: [RequestsResolver, RequestsService],
})
export class RequestsModule {}
