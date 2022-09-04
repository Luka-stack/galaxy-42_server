import {
  Args,
  Context,
  GqlExecutionContext,
  GraphQLExecutionContext,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Response } from 'express';
import { Res, UseGuards } from '@nestjs/common';

import { LoginInput } from './inputs/login.input';
import { AuthService } from './auth.service';
import { UserType } from '../users/types/user.type';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => UserType)
  // @UseGuards(GqlAuthGuard)
  async login(@Args('login') login: LoginInput, @Context() context: any) {
    const { accessToken, user } = await this.authService.login(login.email);

    context.res.cookie('auth-cookie', accessToken, {
      domain: 'localhost', // <- Change to your client domain
      secure: false, // <- Should be true if !development
      sameSite: 'strict',
      httpOnly: true,
      path: '/',
    });

    return user;
  }

  @Query(() => UserType)
  @UseGuards(JwtAuthGuard)
  me(@GetUser() user: User) {
    return user;
  }
}
