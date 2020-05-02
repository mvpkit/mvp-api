import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import {
    Injectable, UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserDto, UserLoginDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async save(userDto: UserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: userDto.email },
    });

    const data = {
      email: userDto.email,
      password: userDto.password,
      first_name: userDto.first_name,
      last_name: userDto.last_name,
    };
    data.password = await bcrypt.hash(userDto.password, 14);

    try {
      const user = await this.userRepository.save(data);
      return user;
    } catch (e) {
      throw e;
    }
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: userLoginDto.email },
    });
    if (!user) {
      return UnauthorizedException;
    }

    const isValid = await bcrypt.compare(userLoginDto.password, user.password);

    if (isValid) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
