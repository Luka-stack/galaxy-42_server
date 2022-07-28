import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class QueryNotificationsInput {
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  rejected: boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  viewed: boolean;
}
