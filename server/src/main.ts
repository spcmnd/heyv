import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
  });
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(parseInt(configService.get<string>('PORT')) ?? 8000);
}
bootstrap();
