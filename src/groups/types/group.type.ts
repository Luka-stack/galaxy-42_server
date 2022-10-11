import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Group')
export class GroupType {
  @Field(() => ID)
  uuid: string;

  @Field()
  name: string;
}
