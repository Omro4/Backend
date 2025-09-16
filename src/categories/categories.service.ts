import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // 1-create()
  async create(
    createCategoryDto: CreateCategoryDto,
    image?: Express.Multer.File,
  ): Promise<Category> {
    const { name, description } = createCategoryDto;
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: name },
    });
    if (existingCategory) {
      throw new ConflictException('Category already exists!');
    }

    const category = this.categoryRepository.create({
      name: name,
      description: description || null,
      image: `/uploads/categories/${image ? image.filename : ''}`,
    });
    return this.categoryRepository.save(category);
  }

  // 2-findAll()
  async findAll(offset: number = 0, limit: number = 10): Promise<object> {
    const [data, count] = await this.categoryRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'ASC' },
    });
    return {
      data,
      count,
    };
  }

  // 3-findOne()
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  // 4-update()
  async update(
    id: number,
    updateData: Partial<CreateCategoryDto>,
    image?: Express.Multer.File,
  ): Promise<Category> {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    const { name, description } = updateData;
    // Check name uniqueness if name is changed
    if (name && name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name },
      });
      if (existingCategory) {
        throw new ConflictException('Category name already exists');
      }
    }
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (image !== undefined)
      category.image = `/uploads/categories/${image ? image.filename : ''}`;
    return this.categoryRepository.save(category);
  }

  // 5-remove()
  async remove(id: number): Promise<{ message: string }> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return { message: 'Category deleted successfully' };
  }

  // 6-find category with its products
  async findOneWithProducts(
    id: number,
    offset: number = 0,
    limit: number = 10,
  ): Promise<object> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const [products, count] = await this.productRepository.findAndCount({
      where: { category: { id } },
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['category'],
    });

    return {
      category,
      products: {
        data: products,
        count,
      },
    };
  }
}
