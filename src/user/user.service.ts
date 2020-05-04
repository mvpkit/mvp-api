import * as bcrypt from 'bcrypt';
import { FindOneOptions, Repository } from 'typeorm';

import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User, UserLoginDto } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(opts?): Promise<User[]> {
    return this.userRepository.find(opts);
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async save(userDto: User): Promise<User> {
    const user = await this.userRepository.findOne({
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
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(userLoginDto.password, user.password);

    if (isValid) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
