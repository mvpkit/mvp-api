
import {
    Body, ConflictException, Controller, Delete, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Req, Request, UnauthorizedException,
    UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User, UserUpdateDto, UserLoginDto, UserCreateDto } from './user.entity';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Body() data) {
    return this.userService.findAll(data);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  currentUser(
    @Req() request
  ) {
    const user = request.user;
    if(!user) throw new UnauthorizedException;
    return user;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Post()
  async create(@Body() dto: UserCreateDto): Promise<User> {
    return await this.userService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() dto: UserUpdateDto,
  ): Promise<User> {
    return await this.userService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.remove(id);
  }
}
