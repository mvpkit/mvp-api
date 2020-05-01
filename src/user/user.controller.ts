import { UserDto } from './user.dto';
import { UserService } from './user.service';

import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('user')
export class UserController {

  constructor(
    private userService: UserService
  ) { }

  @Get()
  async getAll() {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() userDto: UserDto){
    return this.userService.save(userDto);
  }

}
