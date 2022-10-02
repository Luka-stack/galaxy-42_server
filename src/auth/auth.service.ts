import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserInputError } from 'apollo-server-express';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new UserInputError('Wrong credentials');
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      throw new UserInputError('Wrong credentials');
    }

    return user;
  }

  async login(email: string) {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new UserInputError('Wrong credentials');
    }

    return this.createTokens(user);
  }

  createTokens(user: User) {
    return {
      accessToken: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),

      refreshToken: this.jwtService.sign(
        {
          username: user.username,
          sub: user.id,
        },
        {
          secret: this.configService.get('REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    };
  }
}
