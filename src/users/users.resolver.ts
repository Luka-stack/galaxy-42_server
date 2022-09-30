import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserInput } from './inputs/user.input';
import { UsersService } from './users.service';
import { UserType } from './types/user.type';
import { RegisterInput } from './inputs/register.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => UserType)
  register(@Args('user') user: RegisterInput) {
    return this.userService.register(user);
  }

  @Query(() => [UserType])
  users() {
    return this.userService.getUsers();
  }

  @Query(() => UserType)
  getUser(@Args('username') username: string) {
    return this.userService.findUserByUsername(username);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  updatePassword(
    @Args('old') oldPassword: string,
    @Args('new') newPassword: string,
    @GetUser() user: User,
  ) {
    return this.userService.updatePassword(user, oldPassword, newPassword);
  }

  @Mutation(() => UserType)
  @UseGuards(JwtAuthGuard)
  updateUser(@Args('userInput') userInput: UserInput, @GetUser() user: User) {
    return this.userService.updateUser(user, userInput);
  }

  @ResolveField()
  async planets(@Parent() user: User) {
    return this.userService.getUsersPlanet(user);
  }
}
