import { Field, ObjectType } from '@nestjs/graphql';
import { Planet } from '../../planets/entities/planet.entity';
import { UserRole } from '../../planets/entities/user-role';
import { PlanetType } from '../../planets/types/planet.type';

@ObjectType('UsersPlanet')
export class UsersPlanetType {
  @Field()
  role: UserRole;

  @Field(() => PlanetType)
  planet: Planet;
}
