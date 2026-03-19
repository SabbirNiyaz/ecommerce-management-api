import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProductImageEntity } from './entities/product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductImageEntity]),
    AuthModule],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule { }
