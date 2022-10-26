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
import { MessagesService } from './messages.service';
import { MessageType } from './types/message.type';

@Resolver(() => MessageType)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Query(() => [MessageType])
  @UseGuards(JwtAuthGuard)
  getMessages(
    @Args({ name: 'recipients', type: () => [String] })
    recipients: string[],
    @GetUser() user: User,
  ) {
    return this.messagesService.getMessages(recipients, user);
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
