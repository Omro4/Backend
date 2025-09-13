// products.controller.ts
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
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 1- create()
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // 2- findAll()
  @Get()
  async findAll(
    @Query('offset') offset: number = 0, // كانت 1 وخليتها 0 حتى ما يطير واحد من المستخدمين
    @Query('limit') limit: number = 10,
  ) {
    return this.productsService.findAll(offset, limit);
  }

  // 3- findOne()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // 4- update()
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  // 5- remove()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }

  // 6- جديد: إيجاد products حسب category
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query('offset', ParseIntPipe) offset: number = 0,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.productsService.findByCategory(categoryId, offset, limit);
  }
}
