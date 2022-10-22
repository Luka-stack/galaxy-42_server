import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class MessageInput {
  @Field()
  content: string;

  @Field()
  planetId: string;

  @IsOptional()
  @Field({ nullable: true })
  to: string;

  @IsOptional()
  @Field({ nullable: true })
  channel: string;
}
