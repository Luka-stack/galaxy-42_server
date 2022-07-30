import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class RequestInput {
  @IsString()
  @Field()
  planetUuid: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  content: string;
}
