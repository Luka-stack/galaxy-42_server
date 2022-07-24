import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UsersPlanets } from 'src/planets/entities/users-planets.entity';
import { UsersPlanetType } from './users-planet.type';

@ObjectType('User')
export class UserType {
  @Field((type) => ID)
  uuid: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  bio: string;

  @Field({ nullable: true })
  topics: string;

  @Field((type) => [UsersPlanetType])
  planets: UsersPlanets[];
}
