import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, MinLength } from 'class-validator';

@InputType()
export class PlanetInput {
  @MinLength(1)
  @Field()
  name: string;

  @MinLength(50)
  @Field()
  bio: string;

  @MinLength(20)
  @Field()
  requirements: string;

  @Field()
  topics: string;

  @IsBoolean()
  @Field()
  isPublic: boolean;
}
