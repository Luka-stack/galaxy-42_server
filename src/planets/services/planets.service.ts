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
import { UserInputError } from 'apollo-server-express';
import { createWriteStream, unlinkSync } from 'fs';
import { randomUUID } from 'crypto';

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
    userUuid: string,
    planetInput: PlanetInput,
  ): Promise<Planet> {
    const user = await this.userService.findUserById(userUuid);

    const dbPlanet = await this.planetRepo.findOneBy({
      name: planetInput.name,
    });
    if (dbPlanet) {
      throw new UserInputError('Name has to be unique');
    }

    const newPlanet = this.planetRepo.create(planetInput);
    const planetEntity = await this.planetRepo.save(newPlanet);
    this.usersPlanetsService.createRelation(user, planetEntity, UserRole.ADMIN);

    return planetEntity;
  }

  async deletePlanet(planetUuid: string) {
    const planet = await this.planetRepo.findOneBy({ uuid: planetUuid });
    if (!planet) {
      throw new NotFoundException('Planet not found');
    }

    await this.planetRepo.remove(planet);

    return true;
  }

  async updatePlanet(planetUuid: string, planetInput: UpdatePlanetInput) {
    const planet = await this.planetRepo.findOneBy({ uuid: planetUuid });
    if (!planet) {
      throw new UserInputError('Planet not found');
    }

    if (Object.entries(planetInput).length === 0) {
      return planet;
    }

    if (planetInput.image) {
      if (planet.imageUrn) {
        // delete old image
        unlinkSync(`public\\planets\\${planet.imageUrn}`);
      }

      // upload new
      const { createReadStream, filename } = await planetInput.image;
      const randomName = randomUUID() + filename;
      planet.imageUrn = randomName;

      createReadStream().pipe(
        createWriteStream(`./public/planets/${randomName}`),
      );
    }

    planet.updateFields(planetInput);

    return this.planetRepo.save(planet);
  }

  getPlanetsUser(planet: Planet) {
    return this.usersPlanetsService.getPlanetsUser(planet);
  }

  getPlanetById(planetId: number) {
    return this.planetRepo.findOneBy({ id: planetId });
  }
}
