import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
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

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  sendMessage(@Args('message') message: MessageInput, @GetUser() user: User) {
    return this.messagesService.sendMessage(message, user);
  }

  @Subscription(() => MessageType, {
    resolve: (v) => v.newMessage,
    filter: (payload, _varables, context) => {
      if (payload.newMessage.toChannel) {
        return context.req.user.planets.find(
          (p) => p.planetId == payload.planetId,
        );
      }
      return (
        payload.newMessage.recipient === context.req.user.uuid ||
        payload.newMessage.author.uuid === context.req.user.uuid
      );
    },
  })
  @UseGuards(JwtAuthGuard)
  messageCreated() {
    return this.messagesService.messageCreatedSub();
  }

  @ResolveField()
  author(@Parent() message: Message) {
    return this.messagesService.getAuthor(message);
  }
}
