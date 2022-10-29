import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

@InputType()
export class QueryMessageInput {
  @IsString()
  @Field()
  recipient: string;

  @IsBoolean()
  @Field()
  toChannel: boolean;
}
