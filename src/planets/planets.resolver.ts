import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { createWriteStream } from 'fs';

import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Planet } from './entities/planet.entity';
import { PlanetInput } from './inputs/planet.input';
import { UpdatePlanetInput } from './inputs/update-planet.input';
import { PlanetsService } from './services/planets.service';
import { PlanetType } from './types/planet.type';

@Resolver((of) => PlanetType)
export class PlanetsResolver {
  constructor(private readonly planetService: PlanetsService) {}

  @Query((returns) => [PlanetType])
  planets() {
    return this.planetService.getPlanets();
  }

  @Mutation((returns) => PlanetType)
  createPlanet(
    @Args('userId') userId: string,
    @Args('planet') planet: PlanetInput,
  ) {
    return this.planetService.createPlanet(userId, planet);
  }

  @Mutation((returns) => PlanetType)
  updatePlanet(
    @Args('planetUuid') planetUuid: string,
    @Args('planet') planet: UpdatePlanetInput,
  ) {
    return this.planetService.updatePlanet(planetUuid, planet);
  }

  @Mutation((returns) => Boolean)
  deletePlanet(@Args('planetUuid') planetUuid: string) {
    return this.planetService.deletePlanet(planetUuid);
  }

  @Mutation(() => Boolean)
  async uploadPlanetCover(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: any,
  ) {
    return new Promise(async (resolve) => {
      createReadStream()
        .pipe(createWriteStream(`./uploads/${filename}`))
        .on('finish', () => resolve(true))
        .on('error', (error) => {
          console.log(error);
          resolve(false);
        });
    });
  }

  @ResolveField()
  async users(@Parent() planet: Planet) {
    return this.planetService.getPlanetsUser(planet);
  }
}
