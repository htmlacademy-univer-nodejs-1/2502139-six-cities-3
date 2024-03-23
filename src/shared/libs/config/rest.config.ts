import { config } from 'dotenv';
import { Logger } from '../logger/index.js';
import { Config } from './config.interface.js';
import { RestSchema, configRestSchema } from './rest.schema.js';
import { injectable } from 'inversify';
import { inject } from 'inversify';
import { Component } from '../../types/index.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    const parsedOutput = config();

    if (parsedOutput.error || !parsedOutput.parsed) {
      throw new Error(
        'Не удалось найти файл окружения (.env). Возможно, файл не существует.'
      );
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestSchema.getProperties();
    this.logger.info('Файл окружения был найден и успешно прочитан');
  }

  public get<K extends keyof RestSchema>(key: K) {
    return this.config[key];
  }
}
