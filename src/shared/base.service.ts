import * as bcrypt from 'bcrypt';
import { FindOneOptions, Repository } from 'typeorm';

import {
    ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException
} from '@nestjs/common';

@Injectable()
export class BaseService<T> {

  public repo;
  constructor(repo: Repository<T>){
    this.repo = repo;
  }

  async findAll(opts?): Promise<T[]> {
    return this.repo.find(opts);
  }

  findOne(id: number): Promise<T> {
    return this.repo.findOne(id);
  }

  findByEmail(email: string): Promise<T> {
    return this.repo.findOne({ where: { email } });
  }

  async save(data: Partial<T>): Promise<T> {
    try{
      const T = await this.repo.save(data);
      return T;
    } catch (e) {
      throw new InternalServerErrorException;
    }
  }

  async remove(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }

}
