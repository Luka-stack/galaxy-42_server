import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersPlanets } from '../planets/entities/users-planets.entity';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserInput } from './inputs/user.input';
import { UserInputError } from 'apollo-server-express';
import { createWriteStream, unlinkSync } from 'fs';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { RegisterInput } from './inputs/register.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UsersPlanets)
    private readonly userPlanetsRepo: Repository<UsersPlanets>,
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
      throw new UserInputError('Wrong input data', errors);
    }

    const user = this.userRepo.create(registerUser);
    user.password = await bcrypt.hash(user.password, 6);

    try {
      return await this.userRepo.save(user);
    } catch (err) {
      throw err;
    }
  }

  getUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async updateUser(user: User, userInput: UserInput): Promise<User> {
    if (Object.entries(userInput).length === 0) {
      return user;
    }

    const errors: {
      email?: string;
      username?: string;
    } = {};

    if (userInput.email && userInput.email !== user.email) {
      const emailExists = await this.userRepo.count({
        where: { email: userInput.email },
      });
      if (emailExists) {
        errors.email = 'Email already exists';
      }
    }

    if (userInput.username && userInput.username !== userInput.username) {
      const userExists = await this.userRepo.count({
        where: { username: userInput.username },
      });
      if (userExists) {
        errors.username = 'Username already in use';
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new UserInputError('Wrong input data', errors);
    }

    if (userInput.image) {
      if (user.imageUrn) {
        // delete old image
        unlinkSync(`public\\profiles\\${user.imageUrn}`);
      }

      // upload new
      const { createReadStream, filename } = await userInput.image;
      const randomName = randomUUID() + filename;
      user.imageUrn = randomName;

      createReadStream().pipe(
        createWriteStream(`./public/profiles/${randomName}`),
      );
    }

    user.updateFields(userInput);

    return this.userRepo.save(user);
  }

  findUserByUuid(userUuid: string): Promise<User | null> {
    return this.userRepo.findOneBy({ uuid: userUuid });
  }

  findUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOneBy({ email });
  }

  findUserById(userId: number): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id: userId },
      relations: ['planets'],
    });
  }

  getUsersPlanet(user: User) {
    return this.userPlanetsRepo.find({
      where: { userId: user.id },
      relations: ['planet'],
    });
  }
}
