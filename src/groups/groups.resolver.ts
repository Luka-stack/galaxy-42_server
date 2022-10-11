import { Resolver } from '@nestjs/graphql';
import { GroupType } from './types/group.type';

@Resolver(GroupType)
export class GroupsResolver {
  // Create Group
}
