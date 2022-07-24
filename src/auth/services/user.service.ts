import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersPlanets } from 'src/planets/entities/users-planets.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInput } from '../inputs/user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UsersPlanets)
    private readonly userPlanetsRepo: Repository<UsersPlanets>,
  ) {}

  getUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async updateUser(userId: string, userInput: UserInput): Promise<User> {
    const user = await this.userRepo.findOneBy({ uuid: userId });

    if (!user) {
      throw new BadRequestException("User doesn't exist");
    }

    if (Object.entries(userInput).length === 0) {
      return user;
    }

    user.updateFields(userInput);

    return this.userRepo.save(user);
  }

  findUserById(userId: string): Promise<User | null> {
    return this.userRepo.findOneBy({ uuid: userId });
  }

  getUsersPlanet(user: User) {
    return this.userPlanetsRepo.find({
      where: { userId: user.id },
      relations: ['planet'],
    });
  }
}
