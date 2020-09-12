import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CrudController } from './crud.controller';
import { Crud } from './crud.entity';
import { CrudService } from './crud.service';

@Module({
  imports: [TypeOrmModule.forFeature([Crud])],
  exports: [TypeOrmModule, CrudService],
  controllers: [CrudController],
  providers: [CrudService]
})
export class CrudModule {}
