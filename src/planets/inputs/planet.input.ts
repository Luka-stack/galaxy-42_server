import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, MinLength } from 'class-validator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

import { FileUpload } from 'src/common/helpers/file-upload-type';
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

  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true })
  image: Promise<FileUpload>;
}
