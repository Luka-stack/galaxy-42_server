import { Args, Mutation, Query } from '@nestjs/graphql';
import { RequestsService } from './requests.service';
import { RequestType } from './types/request.type';

export class RequestsResolver {
  constructor(private readonly requestService: RequestsService) {}

  @Query((returns) => [RequestType])
  getRequests(
    @Args('planetId', { nullable: true }) planetId?: string,
    @Args('userId', { nullable: true }) userId?: string,
    @Args('viewed', { nullable: true }) viewed?: boolean,
  ) {
    return this.requestService.getRequests(planetId, userId, viewed);
  }

  @Mutation((returns) => [RequestType])
  markAsSeen(
    @Args({ name: 'requestIds', type: () => [String] }) requestIds: string[],
  ) {
    return this.requestService.markAsSeen(requestIds);
  }

  @Mutation((returns) => RequestType)
  resolveRequest(
    @Args('requestId') requestId: string,
    @Args('rejected') rejected: boolean,
  ) {
    return this.requestService.resolveRequest(requestId, rejected);
  }
}
