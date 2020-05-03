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
} from '@nestjs/common';

import { UserDto, UserLoginDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Request() req) {
    const users = await this.userService.findAll();
    return users;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if(!user) throw new NotFoundException;
    return user;
  }

  @Post()
  create(@Body() userDto: UserDto) {
    return this.userService.save(userDto);
  }
}
