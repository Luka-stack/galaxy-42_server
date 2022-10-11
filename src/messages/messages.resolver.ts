import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { MessageInput } from './inputs/message.input';
import { QueryMessageInput } from './inputs/query-message.input';
import { MessageType } from './types/message.type';

@Resolver(MessageType)
export class MessagesResolver {
  @Query(() => [MessageType])
  @UseGuards(JwtAuthGuard)
  getMessages(query: QueryMessageInput, @GetUser() user: User) {
    console.log('GetMessages');
    return [];
  }

  //   TODO can return true/false after implementing subscriptions
  @Mutation(() => MessageType)
  @UseGuards(JwtAuthGuard)
  sendMessage(message: MessageInput, @GetUser() user: User) {
    console.log('SendMessage');
    return null;
  }
}
