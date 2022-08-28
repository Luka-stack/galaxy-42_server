import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @IsString()
  @MinLength(1)
  @Field()
  email: string;

  @IsString()
  @Field()
  password: string;
}
