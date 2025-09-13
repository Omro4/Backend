import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1- create()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 2- findAll()
  @Get()
  async findAll(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.findAll(offset, limit);
  }

  // 3- findOne()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  // 4- update()
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // 5- remove()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
