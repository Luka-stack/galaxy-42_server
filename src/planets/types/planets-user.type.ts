import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entity';
import { UserType } from '../../auth/types/user.type';
import { UserRole } from '../entities/user-role';

@ObjectType('PlanetsUser')
export class PlanetsUserType {
  @Field()
  role: UserRole;

  @Field((type) => UserType)
  user: User;
}
