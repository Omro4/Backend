import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // 1- create()
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // 2- findAll()
  @Get()
  async findAll(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.categoriesService.findAll(offset, limit);
  }

  // 3- findOne()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }

  // 4- update()
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // 5- remove()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.categoriesService.remove(id);
  }

  // 6- جديد: إيجاد category مع products
  // GET /categories/:id/products
  // http://localhost:3000/categories/1/products?offset=0&limit=10
  // http://localhost:3000/categories/1/products
  // http://localhost:3000/categories/1/products?offset=5&limit=5
  // http://localhost:3000/categories/1/products?offset=10&limit=5
  // http://localhost:3000/categories/1/products?offset=15&limit=5
  @Get(':id/products')
  async findOneWithProducts(
    @Param('id', ParseIntPipe) id: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number = 0,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.categoriesService.findOneWithProducts(id, offset, limit);
  }
}
