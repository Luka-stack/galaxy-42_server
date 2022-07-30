import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { RequestInput } from './inputes/request.input';
import { RequestsService } from './requests.service';
import { RequestType } from './types/request.type';
import { Request } from './entities/request.entity';

@Resolver((of) => RequestType)
export class RequestsResolver {
  constructor(private readonly requestService: RequestsService) {}

  @Query((returns) => [RequestType])
  getRequests(
    @Args('planetUuid', { nullable: true }) planetUuid: string,
    @Args('userUuid', { nullable: true }) userUuid: string,
    @Args('viewed', { nullable: true }) viewed: boolean,
  ) {
    return this.requestService.getRequests(planetUuid, userUuid, viewed);
  }

  @Mutation((returns) => RequestType)
  createRequest(
    @Args('userUuid') userUuid: string,
    @Args('request') request: RequestInput,
  ) {
    return this.requestService.createRequest(userUuid, request);
  }

  @Mutation((returns) => [RequestType])
  requestsViewed(
    @Args({ name: 'requestUuids', type: () => [String] })
    requestUuids: string[],
  ) {
    return this.requestService.markAsSeen(requestUuids);
  }

  @Mutation((returns) => RequestType)
  resolveRequest(
    @Args('requestUuid') requestUuid: string,
    @Args('rejected') rejected: boolean,
  ) {
    return this.requestService.resolveRequest(requestUuid, rejected);
  }

  @ResolveField()
  async planet(@Parent() request: Request) {
    return this.requestService.getPlanetByUuid(request.planetuuid);
  }

  @ResolveField()
  async user(@Parent() request: Request) {
    return this.requestService.getUserByUuid(request.useruuid);
  }
}
