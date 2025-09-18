import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  // Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1- create()
  @Post()
  @Roles(UserRole.SUPER_ADMIN)
 @Post()
@ApiOperation({
  summary: 'Create a new user',
  description: 'Creates a new user account'
})
@ApiBody({ type: CreateUserDto })
@ApiResponse({
  status: 201,
  description: 'User successfully created',
  type: User
})
@ApiResponse({
  status: 409,
  description: 'Email already exists'
})
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 2- findAll()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // 3- findOne()
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CUSTOMER)
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  // 4- update()
  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // 5- remove()
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  // 6- get profile of the logged-in user
  @Get('profile/me')
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  // // 7- update user's profile
  // @Put('profile/me/update')
  // async // أسويها بعدين
}
