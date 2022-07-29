import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { UserInput } from '../inputs/user.input';
import { UsersService } from '../services/users.service';
import { UserType } from '../types/user.type';

@Resolver((of) => UserType)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query((returns) => [UserType])
  getUsers() {
    return this.userService.getUsers();
  }

  @Mutation((returns) => UserType)
  updateUser(@Args('userId') userId: string, @Args('user') user: UserInput) {
    return this.userService.updateUser(userId, user);
  }

  @ResolveField()
  async planets(@Parent() user: User) {
    return this.userService.getUsersPlanet(user);
  }
}
