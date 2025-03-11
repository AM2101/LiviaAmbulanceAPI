import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import morgan from 'morgan';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import CONFIG from './constants/config.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix(CONFIG.ROUTE);

  const config = new DocumentBuilder()
    .setTitle('Admin/Insurer User Management')
    .setDescription('Admin/Insurer User Management API Description')
    .setVersion('1.0')
    .addTag('Admin/Insurer User Management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const swaggerApi = CONFIG.ROUTE + '/api';
  SwaggerModule.setup(swaggerApi, app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.use(helmet());

  app.use(morgan('tiny'));

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
