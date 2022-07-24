import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersPlanets } from 'src/planets/entities/users-planets.entity';
import { User } from './entities/user.entity';
import { AuthResolver } from './resolvers/auth.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UsersPlanets])],
  providers: [AuthService, AuthResolver, UserService, UserResolver],
  exports: [UserService],
})
export class AuthModule {}
