import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { Planet } from './entities/planet.entity';
import { PlanetInput } from './inputs/planet.input';
import { UpdatePlanetInput } from './inputs/update-planet.input';
import { PlanetsService } from './services/planets.service';
import { PlanetType } from './types/planet.type';

@Resolver(() => PlanetType)
export class PlanetsResolver {
  constructor(private readonly planetService: PlanetsService) {}

  @Query(() => [PlanetType])
  planets() {
    return this.planetService.getPlanets();
  }

  @Mutation(() => PlanetType)
  createPlanet(
    @Args('userId') userId: string,
    @Args('planet') planet: PlanetInput,
  ) {
    return this.planetService.createPlanet(userId, planet);
  }

  @Mutation(() => PlanetType)
  updatePlanet(
    @Args('planetUuid') planetUuid: string,
    @Args('planet') planet: UpdatePlanetInput,
  ) {
    return this.planetService.updatePlanet(planetUuid, planet);
  }

  @Mutation(() => Boolean)
  deletePlanet(@Args('planetUuid') planetUuid: string) {
    return this.planetService.deletePlanet(planetUuid);
  }

  @ResolveField()
  async users(@Parent() planet: Planet) {
    return this.planetService.getPlanetsUser(planet);
  }
}
