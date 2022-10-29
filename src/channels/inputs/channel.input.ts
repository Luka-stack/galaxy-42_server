import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChannelInput {
  @Field()
  name: string;

  @Field()
  planetId: string;
}
