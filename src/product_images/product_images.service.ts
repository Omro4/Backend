import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImages } from './entities/product_images.entity';
import { CreateProductImageDto } from './dto/create-product_image.dto';
import { UpdateProductImageDto } from './dto/update-product_image.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImages)
    private readonly productImageRepository: Repository<ProductImages>,
    private readonly productsService: ProductsService,
  ) {}

  async create(
    createProductImageDto: CreateProductImageDto,
    file?: Express.Multer.File,
  ): Promise<ProductImages> {
    const { productId, isPrimary, altText } = createProductImageDto;

    if (!productId) {
      throw new Error('productId must be provided');
    }

    const product = await this.productsService.findOne(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (isPrimary) {
      const existingPrimary = await this.productImageRepository.findOne({
        where: { product_id: productId, is_primary: true },
      });

      if (existingPrimary) {
        throw new ConflictException('Product already has a primary image');
      }
    }

    const imageUrl = file
      ? `/uploads/products/${file.filename}`
      : createProductImageDto.imageUrl;

    if (!imageUrl) {
      throw new Error('Either file or imageUrl must be provided');
    }

    const productImage = this.productImageRepository.create({
      product_id: productId,
      product,
      image_url: imageUrl,
      is_primary: isPrimary || false,
      alt_text: altText,
    });

    return await this.productImageRepository.save(productImage);
  }

  async findAll(offset: number = 0, limit: number = 10): Promise<object> {
    const [items, total] = await this.productImageRepository.findAndCount({
      skip: offset,
      take: limit,
      relations: ['product'],
    });

    return {
      items,
      total,
      offset,
      limit,
    };
  }

  async findOne(id: number): Promise<ProductImages> {
    const productImage = await this.productImageRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!productImage) {
      throw new NotFoundException(`Product image with ID ${id} not found`);
    }

    return productImage;
  }

  async findByProduct(
    productId: number,
    offset: number = 0,
    limit: number = 10,
  ): Promise<object> {
    const [items, total] = await this.productImageRepository.findAndCount({
      where: { product_id: productId },
      skip: offset,
      take: limit,
      relations: ['product'],
    });

    return {
      items,
      total,
      offset,
      limit,
    };
  }

  async update(
    id: number,
    updateData: UpdateProductImageDto,
  ): Promise<ProductImages> {
    const productImage = await this.findOne(id);
    const { imageUrl, isPrimary, altText, productId } = updateData;

    if (productId) {
      const product = await this.productsService.findOne(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID (${productId}) not found`);
      }
      productImage.product = product;
      productImage.product_id = productId;
    }

    if (isPrimary === true) {
      const existingPrimaryProductImage =
        await this.productImageRepository.findOne({
          where: {
            product_id: productImage.product_id,
            is_primary: true,
          },
        });

      if (existingPrimaryProductImage) {
        existingPrimaryProductImage.is_primary = false;
        await this.productImageRepository.save(existingPrimaryProductImage);
      }
    }

    if (imageUrl !== undefined) productImage.image_url = imageUrl;
    if (isPrimary !== undefined) productImage.is_primary = isPrimary;
    if (altText !== undefined) productImage.alt_text = altText;

    return this.productImageRepository.save(productImage);
  }

  async setAsPrimary(id: number): Promise<ProductImages> {
    const productImage = await this.findOne(id);
    const existingPrimaryProductImage =
      await this.productImageRepository.findOne({
        where: {
          product_id: productImage.product_id,
          is_primary: true,
        },
      });

    if (existingPrimaryProductImage) {
      existingPrimaryProductImage.is_primary = false;
      await this.productImageRepository.save(existingPrimaryProductImage);
    }

    productImage.is_primary = true;
    return this.productImageRepository.save(productImage);
  }

  async remove(id: number): Promise<{ message: string }> {
    const productImage = await this.findOne(id);
    await this.productImageRepository.remove(productImage);
    return { message: 'ProductImage deleted successfully' };
  }
}
