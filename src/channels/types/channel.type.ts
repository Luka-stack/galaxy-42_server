import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Channel')
export class ChannelType {
  @Field(() => ID)
  uuid: string;

  @Field()
  name: string;
}
