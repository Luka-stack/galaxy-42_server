import { Field, ObjectType } from '@nestjs/graphql';

import { RequestType } from './request.type';
import { Request } from '../entities/request.entity';

@ObjectType('CreatedRequest')
export class CreatedRequestType {
  @Field(() => String)
  type: string;

  @Field(() => RequestType)
  request: Request;
}
