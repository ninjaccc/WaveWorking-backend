import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('WaveWorking-backend')
    .setDescription('WaveWorking API description')
    .setVersion('0.0.1')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log(process.env.PORT);
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
