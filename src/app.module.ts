import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PlanetsModule } from './planets/planets.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      cache: true,
      autoLoadEntities: true,
      synchronize: true,
      host: 'localhost',
      port: 4321,
      database: 'galaxy_42',
      username: 'postgres',
      password: 'postgres',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    AuthModule,
    PlanetsModule,
  ],
})
export class AppModule {}
