import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Param,
  ParseIntPipe,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { User, UserLoginDto } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Request() req) {
    const users = await this.userService.findAll();

    return { users, user: req.user };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Post()
  async create(@Body() userDto: User) {
    try {
      const user = await this.userService.save(userDto);
      return user;
    } catch (e) {
      throw new ConflictException;
    }
  }
}
