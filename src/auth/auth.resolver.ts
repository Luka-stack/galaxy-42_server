import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { LoginInput } from './inputs/login.input';
import { AuthService } from './auth.service';
import { UserType } from '../users/types/user.type';
import { LoginResponseType } from './types/login-response.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => LoginResponseType)
  @UseGuards(GqlAuthGuard)
  login(@Args('login') login: LoginInput, @Context() context: any) {
    return this.authService.login(context.user);
  }

  @Query(() => UserType)
  @UseGuards(JwtAuthGuard)
  me(@GetUser() user: User) {
    return user;
  }
}
