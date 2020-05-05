import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User, UserCreateDto, UserUpdateDto, UserLoginDto } from './user.entity';
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

  async create(dto: UserCreateDto): Promise<User> {
    dto.password = await this.hashPassword(dto.password);
    return await super.create(dto);
  }

  async update(id: number, dto: UserUpdateDto): Promise<User> {
    if(dto.password){
      dto.password = await this.hashPassword(dto.password);
    }
    return await super.update(id, dto);
  }

  private async hashPassword(password: string){
    return await bcrypt.hash(password, 14);
  }
}
