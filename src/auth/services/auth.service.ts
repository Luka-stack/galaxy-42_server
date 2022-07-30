import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { RegisterInput } from '../inputs/register.input';
import { LoginInput } from '../inputs/login.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async register(registerUser: RegisterInput): Promise<User> {
    const errors: {
      email?: string;
      username?: string;
    } = {};

    const emailExists = await this.userRepo.count({
      where: { email: registerUser.email },
    });
    if (emailExists) {
      errors.email = 'Email already exists';
    }

    const userExists = await this.userRepo.count({
      where: { username: registerUser.username },
    });
    if (userExists) {
      errors.username = 'Username already in use';
    }

    if (Object.keys(errors).length > 0) {
      throw new BadRequestException(errors);
    }

    const user = this.userRepo.create(registerUser);
    user.password = await bcrypt.hash(user.password, 6);

    try {
      return await this.userRepo.save(user);
    } catch (err) {
      throw err;
    }
  }

  async logIn(loginInput: LoginInput): Promise<User> {
    const { email, password } = loginInput;

    const user = await this.userRepo.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('Wrong credentials');
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      throw new BadRequestException('Wrong credentials');
    }

    return user;
  }
}
