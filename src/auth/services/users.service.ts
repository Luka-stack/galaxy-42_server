import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersPlanets } from '../../planets/entities/users-planets.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInput } from '../inputs/user.input';
import { UserInputError } from 'apollo-server-express';
import { createWriteStream, fstat, unlinkSync } from 'fs';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UsersPlanets)
    private readonly userPlanetsRepo: Repository<UsersPlanets>,
  ) {}

  getUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async updateUser(userUuid: string, userInput: UserInput): Promise<User> {
    const user = await this.userRepo.findOneBy({ uuid: userUuid });

    if (!user) {
      throw new UserInputError("User doesn't exist");
    }

    if (Object.entries(userInput).length === 0) {
      return user;
    }

    const errors: {
      email?: string;
      username?: string;
    } = {};

    if (userInput.email !== user.email) {
      const emailExists = await this.userRepo.count({
        where: { email: userInput.email },
      });
      if (emailExists) {
        errors.email = 'Email already exists';
      }
    }

    if (userInput.username !== userInput.username) {
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

  findUserById(userUuid: string): Promise<User | null> {
    return this.userRepo.findOneBy({ uuid: userUuid });
  }

  getUsersPlanet(user: User) {
    return this.userPlanetsRepo.find({
      where: { userId: user.id },
      relations: ['planet'],
    });
  }
}
