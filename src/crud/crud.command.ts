import { Command } from 'nestjs-command';

import { Injectable, Logger } from '@nestjs/common';

import { CrudService } from './crud.service';
import * as camelCase from 'camelcase';
@Injectable()
export class CrudCommand {
  constructor(private readonly crudService: CrudService) {}

  @Command({
    command: 'crud:create <entity>',
    describe: 'creates a crud with a given entity',
  })
  async create() {
    const pluralize = require('pluralize');
    const exec = require('child_process').execSync;
    const entity = camelCase(pluralize(process.argv[3], 1));
    Logger.log(`Creating ./src/${entity} ... `);
    const pascalEntity = camelCase(entity, { pascalCase: true });

    // create folder and copy the files from ./src/crud to ./src/${entity}
    try {
      exec(`mkdir src/${entity}`, { encoding: 'utf-8' });
      exec(
        `cp src/crud/crud.controller.ts src/${entity}/${entity}.controller.ts`,
        { encoding: 'utf-8' },
      );
      exec(
        `cp src/crud/crud.controller.spec.ts src/${entity}/${entity}.controller.spec.ts`,
        { encoding: 'utf-8' },
      );
      exec(`cp src/crud/crud.entity.ts src/${entity}/${entity}.entity.ts`, {
        encoding: 'utf-8',
      });
      exec(`cp src/crud/crud.module.ts src/${entity}/${entity}.module.ts`, {
        encoding: 'utf-8',
      });
      exec(`cp src/crud/crud.service.ts src/${entity}/${entity}.service.ts`, {
        encoding: 'utf-8',
      });
      exec(
        `cp src/crud/crud.service.spec.ts src/${entity}/${entity}.service.spec.ts`,
        { encoding: 'utf-8' },
      );

      // search and replace all instances of crud to entity
      await this.replaceAll({
        files: [`/usr/src/app/src/${entity}/*.ts`],
        from: /cruds/g,
        to: pluralize(entity),
      });
      await this.replaceAll({
        files: [`/usr/src/app/src/${entity}/*.ts`],
        from: /Cruds/g,
        to: this.capitalize(pluralize(entity)),
      });
      await this.replaceAll({
        files: [`/usr/src/app/src/${entity}/*.ts`],
        from: /crud/g,
        to: entity,
      });
      await this.replaceAll({
        files: [`/usr/src/app/src/${entity}/*.ts`],
        from: /Crud/g,
        to: this.capitalize(entity),
      });

      Logger.log(`Done `);
      Logger.log(
        `Next, update your ./src/app.module.ts by importing ${entity}.module.ts on the imports section to activate it `,
      );
    } catch (e) {
      return;
    }
  }

  private capitalize(str) {
    return [].map
      .call(str, (char, i) => (i ? char : char.toUpperCase()))
      .join('');
  }

  private async replaceAll(opts: any) {
    const replaceInFiles = require('replace-in-files');
    // search and replace all instances of Crud to Entity (@todo: merge to single call)
    const optionsCapitalize = opts;
    try {
      const {
        changedFiles,
        countOfMatchesByPaths,
        replaceInFilesOptions,
      } = await replaceInFiles(optionsCapitalize);
    } catch (error) {
      Logger.log('Error occurred:');
      Logger.log(error);
    }
  }
}
