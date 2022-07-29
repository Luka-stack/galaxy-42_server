import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersPlanets } from '../planets/entities/users-planets.entity';
import { User } from './entities/user.entity';
import { AuthResolver } from './resolvers/auth.resolver';
import { UsersResolver } from './resolvers/users.resolver';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UsersPlanets])],
  providers: [AuthService, AuthResolver, UsersService, UsersResolver],
  exports: [UsersService],
})
export class AuthModule {}
