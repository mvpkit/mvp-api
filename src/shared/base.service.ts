import * as bcrypt from 'bcrypt';
import { FindOneOptions, Repository } from 'typeorm';

import {
    ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException, ConflictException, NotFoundException
} from '@nestjs/common';

@Injectable()
export class BaseService<T> {

  private repo;
  constructor(repo: Repository<T>){
    this.repo = repo;
  }

  async findAll(opts?): Promise<T[]> {
    return this.repo.find(opts);
  }

  findOne(opts: number | FindOneOptions): Promise<T> {
    return this.repo.findOne(opts);
  }

  async create(data: Partial<T>): Promise<T> {
    try{
      return await this.repo.save(data);
    } catch (e) {
      if(e.code === '23505'){
        throw new ConflictException;
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    try{
      await this.repo.update(id, data);
      return this.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException;
    }
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if(!entity){
      throw new NotFoundException;
    }
    await this.repo.softDelete(id);
  }

}
