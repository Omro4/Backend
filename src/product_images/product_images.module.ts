// src/product_images/product_images.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImagesService } from './product_images.service';
import { ProductImagesController } from './product_images.controller';
import { ProductImages } from './entities/product_images.entity';
// import { ProductsService } from 'src/products/products.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImages]), ProductsModule],
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
  exports: [ProductImagesService],
})
export class ProductImagesModule {}
