import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, MinLength } from 'class-validator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

import { FileUpload } from 'src/common/helpers/file-upload-type';

@InputType()
export class UserInput {
  @MinLength(1)
  @IsOptional()
  @Field({ nullable: true })
  username: string;

  @IsEmail()
  @IsOptional()
  @Field({ nullable: true })
  email: string;

  @IsOptional()
  @Field({ nullable: true })
  bio: string;

  @IsOptional()
  @Field({ nullable: true })
  topics: string;

  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true })
  image: Promise<FileUpload>;
}
