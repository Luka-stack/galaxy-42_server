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
  deletePlanet(@Args('planetUUid') planetUUid: string) {
    return this.planetService.deletePlanet(planetUUid);
  }

  @ResolveField()
  async users(@Parent() planet: Planet) {
    return this.planetService.getPlanetsUser(planet);
  }
}
