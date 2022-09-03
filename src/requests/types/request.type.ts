import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { UserType } from 'src/users/types/user.type';
import { Planet } from 'src/planets/entities/planet.entity';
import { PlanetType } from 'src/planets/types/planet.type';

@ObjectType('Request')
export class RequestType {
  @Field(() => ID)
  uuid: string;

  @Field({ nullable: true })
  content: string;

  @Field()
  viewed: boolean;

  @Field()
  createdAt: Date;

  @Field(() => UserType)
  user: User;

  @Field(() => PlanetType)
  planet: Planet;
}
