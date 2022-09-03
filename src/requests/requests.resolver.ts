import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { RequestInput } from './inputes/request.input';
import { RequestsService } from './requests.service';
import { RequestType } from './types/request.type';
import { Request } from './entities/request.entity';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CombineRequestType } from './types/combine-request.type';

@Resolver(() => RequestType)
export class RequestsResolver {
  constructor(private readonly requestService: RequestsService) {}

  @Query(() => CombineRequestType)
  @UseGuards(JwtAuthGuard)
  async getRequests(@GetUser() user: User) {
    return this.requestService.getRequests(user);
  }

  @Mutation(() => RequestType)
  @UseGuards(JwtAuthGuard)
  createRequest(@Args('request') request: RequestInput, @GetUser() user: User) {
    return this.requestService.createRequest(request, user);
  }

  @Mutation(() => [RequestType])
  @UseGuards(JwtAuthGuard)
  requestsViewed(
    @Args({ name: 'requestUuids', type: () => [String] })
    requestUuids: string[],
    @GetUser() user: User,
  ) {
    return this.requestService.markAsSeen(requestUuids, user);
  }

  @Mutation(() => RequestType)
  @UseGuards(JwtAuthGuard)
  resolveRequest(
    @Args('requestUuid') requestUuid: string,
    @Args('rejected') rejected: boolean,
    @GetUser() user: User,
  ) {
    return this.requestService.resolveRequest(requestUuid, rejected, user);
  }

  @ResolveField()
  async planet(@Parent() request: Request) {
    return this.requestService.getPlanetByUuid(request.planetId);
  }

  @ResolveField()
  async user(@Parent() request: Request) {
    return this.requestService.getUserByUuid(request.userId);
  }
}
