import * as bcrypt from 'bcrypt';
import { FindOneOptions, Repository } from 'typeorm';

import { MailerService } from '@nestjs-modules/mailer';
import {
    ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Crud, CrudCreateDto, CrudLoginDto, CrudUpdateDto } from './crud.entity';

@Injectable()
export class CrudService {
  constructor(
    @InjectRepository(Crud)
    private crudRepository: Repository<Crud>,
    private mailerService: MailerService,
  ) {}

  async findAll(opts?): Promise<Crud[]> {
    return this.crudRepository.find(opts);
  }

  async findOne(opts): Promise<Crud> {
    return this.crudRepository.findOne(opts);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    await this.crudRepository.softDelete(id);
  }

  async login(crudLoginDto: CrudLoginDto) {
    const crud = await this.crudRepository.findOne({
      where: { email: crudLoginDto.email },
    });
    if (!crud) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(crudLoginDto.password, crud.password);

    if (isValid) {
      return crud;
    }
    throw new UnauthorizedException();
  }

  async create(dto: CrudCreateDto): Promise<Crud> {
    dto.password = await this.hashPassword(dto.password);

    try {
      const crud = await this.crudRepository.save(dto);
      this.sendWelcomeEmail(crud);
      return crud;
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: CrudUpdateDto): Promise<Crud> {
    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }

    try {
      await this.crudRepository.update(id, dto);
      return this.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 14);
  }

  findByEmail(email: string): Promise<Crud> {
    return this.findOne({ where: { email } });
  }

  sendWelcomeEmail(crud) {
    this.mailerService
      .sendMail({
        to: crud.email,
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
