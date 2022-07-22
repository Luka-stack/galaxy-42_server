import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';
import { RegisterUserInput } from '../inputs/register-user.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async register(registerUser: RegisterUserInput): Promise<User> {
    const user = this.userRepo.create(registerUser);
    user.id = uuid();

    try {
      return await this.userRepo.save(user);
    } catch (err) {
      const error = err.writeErrors[0].err;
      if (error.code === 11000) {
        throw new ConflictException(
          `${
            error.errmsg.includes('email') ? 'Email' : 'Username'
          } already in use`,
        );
      }
    }
  }

  logIn(): Promise<User[]> {
    return this.userRepo.find();
  }
}
