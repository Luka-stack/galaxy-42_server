import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class QueryMessageInput {
  @IsString()
  @Field()
  recipient: string;
}
