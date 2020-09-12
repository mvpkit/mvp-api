import { UserCreateDto } from './user.entity';
import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class UserCommand {
  constructor(private readonly userService: UserService) {}

  @Command({
    command: 'user:create <email> <password>',
    describe: 'create a user',
  })
  async create() {
    const dto = new UserCreateDto();
    dto.email = process.argv[3];
    dto.password = process.argv[4];
    const user = await this.userService.create(dto);
    console.log(user);
  }

  @Command({
    command: 'user:findAll',
    describe: 'list all users',
  })
  async list() {
    const users = await this.userService.findAll();
    console.log(users);
  }
}
