import { inject } from 'inversify';
import { injectable } from 'inversify';
import { Component } from '../shared/types/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {}

  public async init() {
    this.logger.info('Приложение инициализировано');
    this.logger.info(
      `Значение из переменной окружений $PORT: ${this.config.get('PORT')}`
    );
    this.logger.info(
      `Значение из переменной окружений $DB_HOST: ${this.config.get('DB_HOST')}`
    );
    this.logger.info(
      `Значение из переменной окружений $SALT: ${this.config.get('SALT')}`
    );
  }
}
