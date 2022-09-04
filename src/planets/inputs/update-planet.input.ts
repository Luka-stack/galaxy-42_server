import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, MinLength } from 'class-validator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

import { FileUpload } from '../../common/helpers/file-upload-type';
@InputType()
export class UpdatePlanetInput {
  @MinLength(20)
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

  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true })
  image: Promise<FileUpload>;
}
