
import { FindOneOptions, Repository } from 'typeorm';

import {
    ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Crud, CrudCreateDto, CrudUpdateDto } from './crud.entity';

@Injectable()
export class CrudService {
  constructor(
    @InjectRepository(Crud)
    private crudRepository: Repository<Crud>,
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

  async create(dto: CrudCreateDto): Promise<Crud> {
    try {
      return this.crudRepository.save(dto);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: CrudUpdateDto): Promise<Crud> {
    try {
      await this.crudRepository.update(id, dto);
      return this.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
