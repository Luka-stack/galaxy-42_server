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
import { UsersModule } from './users/users.module';
import { Context } from 'graphql-ws';
import { PubSubModule } from './pub-sub/pub-sub.module';
import { MessagesModule } from './messages/messages.module';
import { ChannelsModule } from './channels/channels.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

// TODO EXPORT CONTANTS

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),
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
      driver: ApolloDriver,
      playground: {
        subscriptionEndpoint: 'ws://localhost:5000/graphql',
      },
      sortSchema: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.qgl'),
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
          onConnect: (context: Context<any>) => {
            const { connectionParams, extra } = context;

            if (!connectionParams.headers) {
              return false;
            }

            (extra as any).headers = connectionParams.headers;
          },
        },
        'subscriptions-transport-ws': {
          path: '/graphql',
        },
      },
      context: ({ req, res, extra }) => {
        if (extra?.request) {
          return {
            req: {
              ...extra?.request,
              headers: {
                ...extra?.request.headers,
                ...extra?.headers,
              },
            },
          };
        }

        return { req, res };
      },
    }),
    AuthModule,
    UsersModule,
    PlanetsModule,
    RequestsModule,
    NotificationsModule,
    PubSubModule,
    MessagesModule,
    ChannelsModule,
  ],
})
export class AppModule {}
