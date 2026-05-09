import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // remove extra properties not in DTO
      forbidNonWhitelisted: true,  // throw error if extra properties sent
      transform: true,             // automatically convert types (string to number)
      transformOptions: {
        enableImplicitConversion: true, // allow implicit type conversion based on DTO types
      }
    }),
  );

  // Enable CORS 
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // allow requests from this origin
    methods: 'GET, POST, HEAD, PUT, PATCH, DELETE, OPTIONS', // allowed HTTP methods
    credentials: true, // allow cookies and authentication headers
  });

  await app.listen(process.env.PORT ?? 5000);
  console.log(`Server is running on port ${process.env.PORT ?? 5000}`);
}
bootstrap();
