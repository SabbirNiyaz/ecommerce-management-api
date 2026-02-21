import { NestFactory } from '@nestjs/core';
import { SellerModule } from './seller/seller.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(SellerModule);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // remove extra properties not in DTO
      forbidNonWhitelisted: true,  // throw error if extra properties sent
      transform: true,             // automatically convert types (string to number)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
