import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginInput } from '../inputs/login.input';
import { RegisterInput } from '../inputs/register.input';
import { AuthService } from '../services/auth.service';
import { UserType } from '../types/user.type';

@Resolver((of) => UserType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => UserType)
  register(@Args('user') user: RegisterInput) {
    return this.authService.register(user);
  }

  @Query((returns) => UserType)
  login(@Args('user') user: LoginInput) {
    return this.authService.logIn(user);
  }
}
