import { ID, Field, ObjectType } from '@nestjs/graphql';
import { Planet } from 'src/planets/entities/planet.entity';
import { PlanetType } from 'src/planets/types/planet.type';

@ObjectType('Notification')
export class NotificationType {
  @Field((type) => ID)
  uuid: string;

  @Field((type) => PlanetType)
  planet: Planet;

  @Field()
  rejected: boolean;

  @Field()
  viewed: boolean;

  @Field()
  createdAt: Date;
}
