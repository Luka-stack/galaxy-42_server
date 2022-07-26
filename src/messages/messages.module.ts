import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PubSubModule } from 'src/pub-sub/pub-sub.module';

import { Channel } from '../channels/entities/channel.entity';
import { User } from '../users/entities/user.entity';
import { Message } from './entities/message.entity';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Channel, User]), PubSubModule],
  providers: [MessagesService, MessagesResolver],
})
export class MessagesModule {}
