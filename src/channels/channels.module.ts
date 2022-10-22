import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Planet } from '../planets/entities/planet.entity';
import { Channel } from './entities/channel.entity';
import { ChannelsResolver } from './channels.resolver';
import { ChannelsService } from './channels.service';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Planet])],
  providers: [ChannelsService, ChannelsResolver],
  exports: [ChannelsService],
})
export class ChannelsModule {}
