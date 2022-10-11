import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class QueryMessageInput {
  @IsOptional()
  @Field({ nullable: true })
  to: string;

  @IsOptional()
  @Field({ nullable: true })
  group: string;
}
