import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));

  await app.listen(process.env.PORT);
  console.log(`App started on port ${process.env.PORT}`);
}

bootstrap();
