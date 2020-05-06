import * as bcrypt from 'bcrypt';
import { BaseService } from 'src/shared/base.service';
import { Repository } from 'typeorm';

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  User,
  UserCreateDto,
  UserLoginDto,
  UserUpdateDto,
} from './user.entity';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
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
    const user = await super.create(dto);
    this.sendWelcomeEmail(user);
    return user;
  }

  async update(id: number, dto: UserUpdateDto): Promise<User> {
    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }
    return await super.update(id, dto);
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 14);
  }

  findByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }

  sendWelcomeEmail(user) {
    this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Thanks for signing up ✔',
        text: 'This is a test welcome message',
      })
      .then(() => {
        Logger.log('welcome email sent');
      })
      .catch(e => {
        Logger.error('error sending welcome email', e);
      });
  }

}
