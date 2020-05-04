import * as bcrypt from 'bcrypt';
import { FindOneOptions, Repository } from 'typeorm';

import {
    ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException
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

  findByEmail(email: string): Promise<T> {
    return this.repo.findOne({ where: { email } });
  }

  async insert(data: T): Promise<T> {
    try{
      const T = await this.repo.insert(data);
      return T;
    } catch (e) {
      throw new InternalServerErrorException;
    }
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    try{
      const T = await this.repo.update(id, data);
      return T;
    } catch (e) {
      throw new InternalServerErrorException;
    }
  }

  async remove(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }

}
