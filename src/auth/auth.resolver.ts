import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { LoginInput } from './inputs/login.input';
import { AuthService } from './auth.service';
import { UserType } from '../users/types/user.type';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => UserType)
  async login(@Args('login') login: LoginInput, @Context() context: any) {
    const { accessToken, user } = await this.authService.login(login.email);

    context.res.cookie('auth-cookie', accessToken, {
      domain: 'localhost',
      secure: false,
      sameSite: 'strict',
      httpOnly: false,
      path: '/',
    });

    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: any) {
    try {
      context.res.clearCookie('auth-cookie', {
        domain: 'localhost',
        secure: false,
        sameSite: 'strict',
        httpOnly: false,
        path: '/',
      });
      return true;
    } catch {
      return false;
    }
  }

  @Query(() => UserType)
  @UseGuards(JwtAuthGuard)
  me(@GetUser() user: User) {
    return user;
  }
}
