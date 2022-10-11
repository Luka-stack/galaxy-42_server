import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../../users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies[config.get('REFRESH_TOKEN')];
          if (!data) return null;
          return data;
        },
      ]),

      ignoreExpiration: false,
      secretOrKey: config.get('REFRESH_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
