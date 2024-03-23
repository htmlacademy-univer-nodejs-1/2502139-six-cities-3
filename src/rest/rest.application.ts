import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Logger } from '../shared/libs/logger/index.js';

export class RestApplication {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config<RestSchema>
  ) {}

  public async init() {
    this.logger.info('Приложение инициализировано');
    this.logger.info(`Значение из переменной окружений $PORT: ${this.config.get('PORT')}`);
    this.logger.info(`Значение из переменной окружений $DB_HOST: ${this.config.get('DB_HOST')}`);
    this.logger.info(`Значение из переменной окружений $SALT: ${this.config.get('SALT')}`);
  }
}
