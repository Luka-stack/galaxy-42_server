import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { UserInputError } from 'apollo-server-express';
import { createWriteStream, unlinkSync } from 'fs';
import { randomUUID } from 'crypto';

import { Planet } from '../entities/planet.entity';
import { PlanetInput } from '../inputs/planet.input';
import { UserRole } from '../entities/user-role';
import { UpdatePlanetInput } from '../inputs/update-planet.input';
import { UsersPlanetsService } from './users-planets.service';
import { User } from '../../users/entities/user.entity';
import { QueryPlanetInput } from '../inputs/query-planet.input';
import { ChannelsService } from '../../channels/channels.service';

@Injectable()
export class PlanetsService {
  constructor(
    @InjectRepository(Planet) private readonly planetRepo: Repository<Planet>,
    private readonly dataSource: DataSource,
    private readonly usersPlanetsService: UsersPlanetsService,
    private readonly channelsService: ChannelsService,
  ) {}

  getPlanets(): Promise<Planet[]> {
    return this.planetRepo.find();
  }

  queryPlanets(query: QueryPlanetInput): Promise<Planet[]> {
    const constrains: any = {};

    if (query.limit) {
      constrains.take = query.limit;
    }

    if (query.order) {
      constrains.order = {
        createdAt: 'DESC',
      };
    }

    return this.planetRepo.find(constrains);
  }

  getLatestsPlanets(order?: string, limit?: number) {
    const constrains: any = {};

    if (limit) {
      constrains.limit = limit;
    }

    if (order) {
      constrains.order = {
        createdAt: 'DESC',
      };
    }

    return this.planetRepo.find(constrains);
  }

  async getPlanet(planetUuid: string): Promise<Planet> {
    const planet = await this.planetRepo.findOneBy({ uuid: planetUuid });
    if (!planet) {
      throw new UserInputError('Planet not found');
    }
    return planet;
  }

  async getPlanetAuth(planetUuid: string, user: User): Promise<Planet> {
    const planet = await this.planetRepo.findOneBy({ uuid: planetUuid });
    if (!planet) {
      throw new UserInputError('Planet not found');
    }

    const isAdmin = user.planets.some(
      (p) => p.planetId === planet.id && p.role === 'ADMIN',
    );

    if (!isAdmin) {
      throw new ForbiddenException();
    }

    return planet;
  }

  async getMyPlanets(user: User): Promise<Planet[]> {
    const myPlanetsIds = user.planets.map((p) => p.planetId);

    return this.planetRepo.find({
      where: { id: In(myPlanetsIds) },
    });
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
      const { createReadStream, filename } = await planetInput.image;
      const randomName = randomUUID() + filename;
      newPlanet.imageUrn = randomName;

      createReadStream().pipe(
        createWriteStream(`./public/planets/${randomName}`),
      );
    }

    let planetEntity;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const planetObj = await this.planetRepo.save(newPlanet);
      planetEntity = await queryRunner.manager.save(planetObj);

      await queryRunner.manager.save(
        this.channelsService.createChannel('public', planetEntity),
      );
      await queryRunner.manager.save(
        this.usersPlanetsService.createRelation(
          user,
          planetEntity,
          UserRole.ADMIN,
        ),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }

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

  getPlanetsChannels(planet: Planet) {
    return this.channelsService.getPlanetsChannels(planet);
  }

  getPlanetById(planetId: number) {
    return this.planetRepo.findOneBy({ id: planetId });
  }
}
