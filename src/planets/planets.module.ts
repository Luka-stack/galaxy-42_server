import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Planet } from './entities/planet.entity';
import { UsersPlanets } from './entities/users-planets.entity';
import { PlanetResolver } from './planet.resolver';
import { PlanetService } from './planet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Planet, UsersPlanets]), AuthModule],
  providers: [PlanetService, PlanetResolver],
})
export class PlanetsModule {}
