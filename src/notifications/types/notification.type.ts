import { ID, Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Notification')
export class NotificationType {
  @Field((type) => ID)
  uuid: string;

  @Field()
  content: string;

  @Field()
  planetId: string;

  @Field()
  rejected: boolean;

  @Field()
  viewed: boolean;

  @Field()
  createdAt: Date;
}
