import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
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

  @Query(() => PlanetType)
  getPlanet(@Args('planetUuid') planetUuid: string) {
    return this.planetService.getPlanet(planetUuid);
  }

  @Mutation(() => PlanetType)
  @UseGuards(JwtAuthGuard)
  createPlanet(@Args('planet') planet: PlanetInput, @GetUser() user: User) {
    return this.planetService.createPlanet(user, planet);
  }

  @Mutation(() => PlanetType)
  @UseGuards(JwtAuthGuard)
  updatePlanet(
    @Args('planetUuid') planetUuid: string,
    @Args('planet') planet: UpdatePlanetInput,
    @GetUser() user: User,
  ) {
    return this.planetService.updatePlanet(planetUuid, planet, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  deletePlanet(@Args('planetUuid') planetUuid: string, @GetUser() user: User) {
    return this.planetService.deletePlanet(planetUuid, user);
  }

  @ResolveField()
  async users(@Parent() planet: Planet) {
    return this.planetService.getPlanetsUser(planet);
  }
}
