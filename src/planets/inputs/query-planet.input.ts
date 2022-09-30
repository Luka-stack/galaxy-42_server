import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class QueryPlanetInput {
  @IsOptional()
  @Field()
  order: string;

  @IsOptional()
  @Field({ nullable: true })
  limit: number;
}
