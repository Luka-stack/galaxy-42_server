import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { UserType } from 'src/users/types/user.type';

@ObjectType('Message')
export class MessageType {
  @Field(() => ID)
  uuid: string;

  @Field()
  recipient: string;

  @Field(() => UserType)
  author: User;

  @Field()
  content: string;

  @Field()
  createdAt: Date;
}
