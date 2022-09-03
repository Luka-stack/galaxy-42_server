import { Field, ObjectType } from '@nestjs/graphql';

import { UserType } from '../..//users/types/user.type';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class LoginResponseType {
  @Field()
  accessToken: string;

  @Field(() => UserType)
  user: User;
}
