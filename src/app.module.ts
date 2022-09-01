import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PlanetsModule } from './planets/planets.module';
import { RequestsModule } from './requests/requests.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { getEnvPath } from './common/helpers/env.helper';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
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
    RequestsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
