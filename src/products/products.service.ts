// products.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // 1-create()
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, description, stock, price, categoryId } = createProductDto;

    // Check if product name already exists
    const existingProduct = await this.productRepository.findOne({
      where: { name },
    });
    if (existingProduct) {
      throw new ConflictException('Product already exists');
    }

    // Handle category relation
    let category: Category | null = null;
    if (categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const product = this.productRepository.create({
      name,
      description,
      price: price || 0,
      stock: stock || 0,
      category,
    });

    return this.productRepository.save(product);
  }

  // 2-findAll() - مع تضمين الـ category
  async findAll(offset: number = 0, limit: number = 10): Promise<object> {
    const [data, count] = await this.productRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['category'], // تضمين بيانات الـ category
    });
    return {
      data,
      count,
    };
  }

  // 3-findOne() - مع تضمين الـ category
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'], // تضمين بيانات الـ category
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // 4-update() - مع دعم تحديث الـ category
  async update(id: number, updateData: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    const { name, description, stock, price, categoryId } = updateData;

    // Check name uniqueness if name is changed
    if (name && name !== product.name) {
      const existingProduct = await this.productRepository.findOne({
        where: { name },
      });
      if (existingProduct) {
        throw new ConflictException('Product already exists');
      }
    }

    // Handle category update
    if (categoryId !== undefined) {
      if (categoryId === null) {
        product.category = null;
        // product.categoryId = null;
      } else {
        const category = await this.categoryRepository.findOne({
          where: { id: categoryId },
        });
        if (!category) {
          throw new NotFoundException('Category not found');
        }
        product.category = category;
        // product.categoryId = categoryId;
      }
    }

    // Update other fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = Number(stock);
    if (price !== undefined) product.price = Number(price);

    return this.productRepository.save(product);
  }

  // 5-remove()
  async remove(id: number): Promise<{ message: string }> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }

  // 6- دالة جديدة: إيجاد products حسب category
  async findByCategory(
    categoryId: number,
    offset: number = 0,
    limit: number = 10,
  ): Promise<object> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const [data, count] = await this.productRepository.findAndCount({
      where: { category: { id: categoryId } },
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['category'],
    });

    return {
      data,
      count,
    };
  }
}
