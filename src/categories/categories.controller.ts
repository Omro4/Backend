import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueName}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ) {
    return this.categoryService.create(createCategoryDto, image);
  }

  @Get()
  async getAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueName}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /.(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ) {
    return this.categoryService.update(id, updateCategoryDto, image);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.categoryService.remove(id);
  }

  @Get(':id/products')
  async findOneWithProducts(
    @Param('id', ParseIntPipe) id: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number = 0,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.categoryService.findOneWithProducts(id, offset, limit);
  }
}
