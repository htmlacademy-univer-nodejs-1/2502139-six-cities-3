import { inject } from 'inversify';
import { injectable } from 'inversify';
import { Component } from '../shared/types/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { OfferService } from '../shared/modules/offer/index.js';
import { CommentService } from '../shared/modules/comment/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService)
    private readonly commentService: CommentService
  ) {}

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('Приложение инициализировано');
    this.logger.info(
      `Значение из переменной окружений PORT: ${this.config.get('PORT')}`
    );

    this.logger.info('Инициализация базы данных...');
    await this._initDb();
    this.logger.info('База данных инициализирована');

    const comm = await this.commentService.create({
      offer: '661d0d91679ffefd50831b34',
      author: '661bd9060f790752f2658574',
      publicationDate: '2024-04-14T13:24:22.697Z',
      rating: 4,
      text: 'Rating up!'
    });
    console.log(comm);
  }
}
