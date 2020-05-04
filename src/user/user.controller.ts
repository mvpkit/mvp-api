import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import {
    Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch,
    Post, Request, UseGuards
} from '@nestjs/common';

import { User, UserLoginDto } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Body() data) {
    return this.userService.findAll(data);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() userDto: User) : Promise<User> {
    try {
      const user = await this.userService.insert(userDto);
      return user;
    } catch (e) {
      throw new ConflictException();
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() userDto: Partial<User>) : Promise<User> {
    try {
      const user = await this.userService.update(id, userDto);
      return user;
    } catch (e) {
      throw new ConflictException();
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException();
    return await this.userService.remove(id);
  }
}
