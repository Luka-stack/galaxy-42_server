import { ID, Field, ObjectType } from '@nestjs/graphql';

import { Group } from '../../groups/entities/group.entity';
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

  @Field()
  imageUrl: string;

  @Field()
  createdAt: number;

  @Field((type) => [PlanetsUserType])
  users: UsersPlanets[];

  @Field((type) => [Group])
  groups: Group[];
}
