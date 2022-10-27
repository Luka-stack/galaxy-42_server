import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Message } from './entities/message.entity';
import { MessageInput } from './inputs/message.input';
import { QueryMessageInput } from './inputs/query-message.input';
import { MessagesService } from './messages.service';
import { MessageType } from './types/message.type';

@Resolver(() => MessageType)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Query(() => [MessageType])
  @UseGuards(JwtAuthGuard)
  getMessages(@Args('query') query: QueryMessageInput, @GetUser() user: User) {
    return this.messagesService.getMessages(query, user);
  }

  //   TODO can return true/false after implementing subscriptions
  @Mutation(() => MessageType)
  @UseGuards(JwtAuthGuard)
  sendMessage(@Args('message') message: MessageInput, @GetUser() user: User) {
    return this.messagesService.sendMessage(message, user);
  }

  @ResolveField()
  author(@Parent() message: Message) {
    return this.messagesService.getAuthor(message);
  }
}
