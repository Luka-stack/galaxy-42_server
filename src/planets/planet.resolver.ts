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
import { PlanetService } from './planet.service';
import { PlanetType } from './types/planet.type';

@Resolver((of) => PlanetType)
export class PlanetResolver {
  constructor(private readonly planetService: PlanetService) {}

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
    @Args('planetId') planetId: string,
    @Args('planet') planet: UpdatePlanetInput,
  ) {
    return this.planetService.updatePlanet(planetId, planet);
  }

  @Mutation((returns) => Boolean)
  deletePlanet(@Args('planetId') planetId: string) {
    return this.planetService.deletePlanet(planetId);
  }

  @ResolveField()
  async users(@Parent() planet: Planet) {
    return this.planetService.getPlanetsUser(planet);
  }
}
