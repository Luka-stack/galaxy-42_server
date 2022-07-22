import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RegisterUserInput } from '../inputs/register-user.input';
import { AuthService } from '../services/auth.service';
import { UserType } from '../types/user.type';

@Resolver((of) => UserType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => UserType)
  register(@Args('user') user: RegisterUserInput) {
    return this.authService.register(user);
  }

  @Query((returns) => [UserType])
  logIn() {
    return this.authService.logIn();
  }
}
