import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, MinLength } from 'class-validator';

@InputType()
export class UpdatePlanetInput {
  @MinLength(50)
  @IsOptional()
  @Field({ nullable: true })
  bio: string;

  @MinLength(20)
  @IsOptional()
  @Field({ nullable: true })
  requirements: string;

  @IsOptional()
  @Field({ nullable: true })
  topics: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isPublic: boolean;
}
