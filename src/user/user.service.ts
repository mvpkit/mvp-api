import * as bcrypt from 'bcrypt';
import { FindOneOptions, Repository } from 'typeorm';

import { MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  User,
  UserRegisterDto,
  UserSsoGoogleDto,
  UserLoginDto,
  UserUpdateDto,
  UserSource,
} from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailerService: MailerService,
  ) {}

  async findAll(opts?): Promise<User[]> {
    return this.userRepository.find(opts);
  }

  async findOne(opts): Promise<User> {
    return this.userRepository.findOne(opts);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    await this.userRepository.softDelete(id);
  }

  async login(userLoginDto: UserLoginDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: userLoginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(userLoginDto.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async register(dto: UserRegisterDto): Promise<User> {
    dto.password = await this.hashPassword(dto.password);
    return this.create(dto);
  }

  async create(dto: Partial<User>): Promise<User> {
    console.log('creating', dto);
    try {
      const user = await this.userRepository.save(dto);
      this.sendWelcomeEmail(user);
      return user;
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: UserUpdateDto): Promise<User> {
    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }

    try {
      await this.userRepository.update(id, dto);
      return this.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async findByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }

  async sendWelcomeEmail(user) {
    this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Thanks for signing up ✔',
        text: 'This is a test welcome message',
      })
      .then(() => {
        Logger.log('welcome email sent');
      })
      .catch((e) => {
        Logger.error('error sending welcome email', e);
      });
  }

  /**
   * declare a user have successfully been identified
   * useful for 3rd party integrations such as Segment, Intercom, and Zendesk
   */
  async loggedIn(user: User): Promise<User> {
    await this.update(user.id, { lastLoginAt: new Date() });
    return user;
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 14);
  }
}
