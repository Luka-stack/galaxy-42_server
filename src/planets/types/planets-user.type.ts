import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { UserType } from '../../users/types/user.type';
import { UserRole } from '../entities/user-role';

@ObjectType('PlanetsUser')
export class PlanetsUserType {
  @Field()
  role: UserRole;

  @Field((type) => UserType)
  user: User;
}
