import { Field, ObjectType } from '@nestjs/graphql';

import { RequestType } from './request.type';
import { Request } from '../entities/request.entity';

@ObjectType('CombineRequest')
export class CombineRequestType {
  @Field(() => [RequestType])
  users: Request[];

  @Field(() => [RequestType])
  planets: Request[];
}
