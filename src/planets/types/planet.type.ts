import { ID, Field, ObjectType } from '@nestjs/graphql';
import { ChannelType } from 'src/channels/types/channel.type';

import { Channel } from '../../channels/entities/channel.entity';
import { UsersPlanets } from '../entities/users-planets.entity';
import { PlanetsUserType } from './planets-user.type';

@ObjectType('Planet')
export class PlanetType {
  @Field(() => ID)
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

  @Field(() => [PlanetsUserType])
  users: UsersPlanets[];

  @Field(() => [ChannelType])
  channels: Channel[];
}
