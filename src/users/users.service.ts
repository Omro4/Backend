import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 1-create()
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password, role } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: { email: email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email: email,
      name: name,
      role: role || UserRole.CUSTOMER,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  // 2-findAll()
  async findAll(offset: number = 1, limit: number = 10): Promise<object> {
    // I used Promise<object> instade of Promise<{}> because `{}` (\"empty object\") type allows any non-nullish value, including literals like `0` and `\"\"`
    const [data, count] = await this.userRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      data,
      count,
    };
  }

  // 3-findOne()
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // 4-update()
  async update(id: number, updateData: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    // Destructure only allowed fields
    const { email, name } = updateData;
    // Check email uniqueness if email is changed
    if (email && email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }
    // Assign only allowed fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    return this.userRepository.save(user);
  }

  // 5-remove()
  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  // Add these methods to your existing UsersService

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updatePassword(id: number, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found!');
    }
    user.password = password;
    return this.userRepository.save(user);
  }
}
