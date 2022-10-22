import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ChannelsService } from './channels.service';
import { ChannelInput } from './inputs/channel.input';
import { ChannelType } from './types/channel.type';

@Resolver(() => ChannelType)
export class ChannelsResolver {
  constructor(private readonly channelsService: ChannelsService) {}

  @Mutation(() => ChannelType)
  @UseGuards(JwtAuthGuard)
  createChannel(@Args('channel') channel: ChannelInput, @GetUser() user: User) {
    return this.channelsService.saveChannel(channel, user);
  }
}
