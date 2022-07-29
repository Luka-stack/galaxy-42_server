import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { Planet } from '../entities/planet.entity';
import { UserRole } from '../entities/user-role';
import { UsersPlanets } from '../entities/users-planets.entity';

export class UsersPlanetsService {
  constructor(
    @InjectRepository(UsersPlanets)
    private readonly repo: Repository<UsersPlanets>,
  ) {}

  createRelation(
    user: User,
    planet: Planet,
    role: UserRole,
  ): Promise<UsersPlanets> {
    const relation = this.repo.create({
      userId: user.id,
      planetId: planet.id,
      user,
      planet,
      role,
    });

    return this.repo.save(relation);
  }

  async getPlanetsUser(planet: Planet) {
    return this.repo.find({
      where: { planetId: planet.id },
      relations: ['user'],
    });
  }
}
