import { CrudCreateDto } from './crud.entity';
import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';

@Injectable()
export class CrudCommand {
  constructor(private readonly crudService: CrudService) {}

  @Command({
    command: 'crud:something',
    describe: 'some crud command',
  })
  async something() {
    console.log('running something');
  }
}
