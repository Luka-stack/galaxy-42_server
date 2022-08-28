import { ID, Field, ObjectType } from '@nestjs/graphql';
import { UsersPlanets } from '../entities/users-planets.entity';
import { PlanetsUserType } from './planets-user.type';

@ObjectType('Planet')
export class PlanetType {
  @Field((type) => ID)
  uuid: string;

  @Field()
  name: string;

  @Field()
  bio: string;

  @Field()
  requirements: string;

  @Field()
  topics: string;

  @Field()
  isPublic: boolean;

  @Field((type) => [PlanetsUserType])
  users: UsersPlanets[];
}
