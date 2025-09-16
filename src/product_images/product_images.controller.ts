import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  // FileTypeValidator,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateProductImageDto } from './dto/create-product_image.dto';
import { UpdateProductImageDto } from './dto/update-product_image.dto';
import { ProductImagesService } from './product_images.service';

@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueName}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() createProductImageDto: CreateProductImageDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // new FileTypeValidator({ fileType: /.(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ) {
    return this.productImagesService.create(createProductImageDto, image);
  }

  @Get()
  async findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number = 0,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.productImagesService.findAll(offset, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productImagesService.findOne(id);
  }

  @Get('product/:productId')
  async findByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number = 0,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.productImagesService.findByProduct(productId, offset, limit);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductImageDto: UpdateProductImageDto,
  ) {
    return this.productImagesService.update(id, updateProductImageDto);
  }

  @Patch(':id/set-primary')
  async setAsPrimary(@Param('id', ParseIntPipe) id: number) {
    return this.productImagesService.setAsPrimary(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productImagesService.remove(id);
  }
}
