import { Field, ID, ObjectType } from '@nestjs/graphql';

import { UsersPlanets } from '../../planets/entities/users-planets.entity';
import { UsersPlanetType } from './users-planet.type';

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  uuid: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  bio: string;

  @Field({ nullable: true })
  topics: string;

  @Field()
  imageUrl: string;

  @Field()
  createdAt: number;

  @Field(() => [UsersPlanetType])
  planets: UsersPlanets[];
}
