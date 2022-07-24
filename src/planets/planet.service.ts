import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planet } from './entities/planet.entity';
import { PlanetInput } from './inputs/planet.input';
import { UserService } from 'src/auth/services/user.service';
import { UserRole } from './entities/user-role';
import { UsersPlanets } from './entities/users-planets.entity';
import { UpdatePlanetInput } from './inputs/update-planet.input';

@Injectable()
export class PlanetService {
  constructor(
    @InjectRepository(Planet) private readonly planetRepo: Repository<Planet>,
    @InjectRepository(UsersPlanets)
    private readonly userPlanetsRepo: Repository<UsersPlanets>,
    private readonly userService: UserService,
  ) {}

  async getPlanets(): Promise<Planet[]> {
    return this.planetRepo.find();
  }

  async createPlanet(
    userId: string,
    planetInput: PlanetInput,
  ): Promise<Planet> {
    const user = await this.userService.findUserById(userId);

    const dbPlanet = await this.planetRepo.findOneBy({
      name: planetInput.name,
    });
    if (dbPlanet) {
      throw new BadRequestException('Name has to be unique');
    }

    const newPlanet = this.planetRepo.create(planetInput);

    const planetEntity = await this.planetRepo.save(newPlanet);

    const relation = this.userPlanetsRepo.create({
      userId: user.id,
      planetId: planetEntity.id,
      role: UserRole.ADMIN,
      user,
      planet: planetEntity,
    });
    this.userPlanetsRepo.save(relation);

    return planetEntity;
  }

  async deletePlanet(planetId: string) {
    const planet = await this.planetRepo.findOneBy({ uuid: planetId });
    if (!planet) {
      throw new NotFoundException('Planet not found');
    }

    await this.planetRepo.remove(planet);

    return true;
  }

  async updatePlanet(planetId: string, planetInput: UpdatePlanetInput) {
    const planet = await this.planetRepo.findOneBy({ uuid: planetId });
    if (!planet) {
      throw new NotFoundException('Planet not found');
    }

    planet.updateFields(planetInput);

    return this.planetRepo.save(planet);
  }

  async getPlanetsUser(planet: Planet) {
    return this.userPlanetsRepo.find({
      where: { planetId: planet.id },
      relations: ['user'],
    });
  }
}
