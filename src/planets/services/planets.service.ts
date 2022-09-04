import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInputError } from 'apollo-server-express';
import { createWriteStream, unlinkSync } from 'fs';
import { randomUUID } from 'crypto';

import { Planet } from '../entities/planet.entity';
import { PlanetInput } from '../inputs/planet.input';
import { UserRole } from '../entities/user-role';
import { UpdatePlanetInput } from '../inputs/update-planet.input';
import { UsersPlanetsService } from './users-planets.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class PlanetsService {
  constructor(
    @InjectRepository(Planet) private readonly planetRepo: Repository<Planet>,
    private readonly usersPlanetsService: UsersPlanetsService,
  ) {}

  async getPlanets(): Promise<Planet[]> {
    return this.planetRepo.find();
  }

  async createPlanet(user: User, planetInput: PlanetInput): Promise<Planet> {
    const dbPlanet = await this.planetRepo.findOneBy({
      name: planetInput.name,
    });
    if (dbPlanet) {
      throw new UserInputError('Name has to be unique');
    }

    const newPlanet = this.planetRepo.create(planetInput);

    if (planetInput.image) {
      // upload new
      const { createReadStream, filename } = await planetInput.image;
      const randomName = randomUUID() + filename;
      newPlanet.imageUrn = randomName;

      createReadStream().pipe(
        createWriteStream(`./public/planets/${randomName}`),
      );
    }

    const planetEntity = await this.planetRepo.save(newPlanet);
    this.usersPlanetsService.createRelation(user, planetEntity, UserRole.ADMIN);

    return planetEntity;
  }

  async deletePlanet(planetUuid: string, user: User): Promise<boolean> {
    const planet = await this.planetRepo.findOneBy({ uuid: planetUuid });
    if (!planet) {
      throw new NotFoundException('Planet not found');
    }

    const isAdmin = user.planets.some(
      (p) => p.planetId === planet.id && p.role === UserRole.ADMIN,
    );

    if (!isAdmin) {
      throw new UserInputError("You don't have access to this planet");
    }

    await this.planetRepo.remove(planet);

    return true;
  }

  async updatePlanet(
    planetUuid: string,
    planetInput: UpdatePlanetInput,
    user: User,
  ) {
    const planet = await this.planetRepo.findOneBy({ uuid: planetUuid });
    if (!planet) {
      throw new UserInputError('Planet not found');
    }

    const isAdmin = user.planets.some(
      (p) => p.planetId === planet.id && p.role === UserRole.ADMIN,
    );

    if (!isAdmin) {
      throw new UserInputError("You don't have access to this planet");
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
