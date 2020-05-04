import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User, UserLoginDto } from './user.entity';
import { BaseService } from 'src/shared/base.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: userLoginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(userLoginDto.password, user.password);

    if (isValid) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async save(userDto: User): Promise<User> {
    const user = await this.repo.findOne({
      where: { email: userDto.email },
    });

    const data = {
      email: userDto.email,
      password: userDto.password,
      firstName: userDto.firstName,
      lastName: userDto.lastName,
    };
    data.password = await bcrypt.hash(userDto.password, 14);

    try {
      const user = await this.repo.save(data);
      return user;
    } catch (e) {
      throw e;
    }
  }
}
