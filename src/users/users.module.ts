import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersPlanets } from 'src/planets/entities/users-planets.entity';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UsersPlanets])],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
