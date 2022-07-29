import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/auth/entities/user.entity';
import { UserType } from 'src/auth/types/user.type';
import { Planet } from 'src/planets/entities/planet.entity';
import { PlanetType } from 'src/planets/types/planet.type';

@ObjectType('Request')
export class RequestType {
  @Field((type) => ID)
  uuid: string;

  @Field({ nullable: true })
  content: string;

  @Field()
  viewed: boolean;

  @Field()
  createdAt: Date;

  @Field((type) => UserType)
  user: User;

  @Field((type) => PlanetType)
  planet: Planet;
}
