import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersPlanets } from '../../planets/entities/users-planets.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInput } from '../inputs/user.input';

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
      throw new BadRequestException("User doesn't exist");
    }

    if (Object.entries(userInput).length === 0) {
      return user;
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
