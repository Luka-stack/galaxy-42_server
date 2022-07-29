import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planet } from '../entities/planet.entity';
import { PlanetInput } from '../inputs/planet.input';
import { UsersService } from '../../auth/services/users.service';
import { UserRole } from '../entities/user-role';
import { UpdatePlanetInput } from '../inputs/update-planet.input';
import { UsersPlanetsService } from './users-planets.service';

@Injectable()
export class PlanetsService {
  constructor(
    @InjectRepository(Planet) private readonly planetRepo: Repository<Planet>,
    private readonly usersPlanetsService: UsersPlanetsService,
    private readonly userService: UsersService,
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
    this.usersPlanetsService.createRelation(user, planetEntity, UserRole.ADMIN);

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

  getPlanetsUser(planet: Planet) {
    return this.usersPlanetsService.getPlanetsUser(planet);
  }
}
