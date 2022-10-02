import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { UserType } from '../users/types/user.type';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginResponseType } from './types/login-response.type';
import { LoginInput } from './inputs/login.input';
import { JwtCookieAuthGuard } from './guards/jwt-cookie.guard';

@Resolver(() => UserType)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Mutation(() => LoginResponseType)
  async login(@Args('login') login: LoginInput, @Context() context: any) {
    const { accessToken, refreshToken } = await this.authService.login(
      login.email,
    );

    console.log('Access:', accessToken, 'refresh:', refreshToken);

    context.res.cookie(this.config.get('REFRESH_TOKEN'), refreshToken, {
      domain: 'localhost',
      secure: false,
      sameSite: 'strict',
      httpOnly: true,
      path: '/',
    });

    return { accessToken };
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: any) {
    try {
      context.res.clearCookie(this.config.get('REFRESH_TOKEN'), {
        domain: 'localhost',
        secure: false,
        sameSite: 'strict',
        httpOnly: true,
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

  @Query(() => LoginResponseType)
  @UseGuards(JwtCookieAuthGuard)
  async refreshToken(@GetUser() user: User, @Context() context: any) {
    const { accessToken, refreshToken } = this.authService.createTokens(user);

    context.res.cookie(this.config.get('REFRESH_TOKEN'), refreshToken, {
      domain: 'localhost',
      secure: false,
      sameSite: 'strict',
      httpOnly: true,
      path: '/',
    });

    console.log('Access:', accessToken, 'refresh:', refreshToken);

    return { accessToken };
  }
}
