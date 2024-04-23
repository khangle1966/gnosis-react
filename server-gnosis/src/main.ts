import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'; // Đây là cách import express

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/uploads', express.static('uploads')); // Đây là dòng sử dụng express.static

  app.enableCors(); // Cho phép tất cả nguồn gốc
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();
