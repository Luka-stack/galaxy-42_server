import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Planet } from './entities/planet.entity';
import { UsersPlanets } from './entities/users-planets.entity';
import { PlanetsResolver } from './planets.resolver';
import { PlanetsService } from './services/planets.service';
import { UsersPlanetsService } from './services/users-planets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Planet, UsersPlanets]), AuthModule],
  providers: [PlanetsService, UsersPlanetsService, PlanetsResolver],
  exports: [UsersPlanetsService],
})
export class PlanetsModule {}
