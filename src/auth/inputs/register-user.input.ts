import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @IsString()
  @MinLength(1)
  @Field()
  username: string;

  @IsString()
  @MinLength(7)
  @Field()
  password: string;

  @IsEmail()
  @Field()
  email: string;
}
