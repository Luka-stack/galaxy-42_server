import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
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
import { CreatedRequestType } from './types/created-request.type';

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

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  resolveRequest(
    @Args('requestUuid') requestUuid: string,
    @Args('rejected') rejected: boolean,
    @GetUser() user: User,
  ) {
    return this.requestService.resolveRequest(requestUuid, rejected, user);
  }

  @Subscription(() => CreatedRequestType, {
    resolve: (payload, _args, context) => {
      return {
        type: payload.admin === context.req.user.id ? 'planets' : 'users',
        request: payload.request,
      };
    },
    filter: (payload, _variables, context) => {
      return (
        payload.admin === context.req.user.id ||
        payload.request.userId === context.req.user.id
      );
    },
  })
  @UseGuards(JwtAuthGuard)
  requestCreated() {
    return this.requestService.requestCreatedSub();
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
