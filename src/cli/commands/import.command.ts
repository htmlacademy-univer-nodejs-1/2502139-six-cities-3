import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
// import chalk from 'chalk';
import {
  createOffer,
  getErrorMessage,
  getMongoURI,
} from '../../shared/helpers/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { Logger, PinoLogger } from '../../shared/libs/logger/index.js';
import {
  DatabaseClient,
  MongoDatabaseClient,
} from '../../shared/libs/database-client/index.js';
import {
  DefaultUserService,
  UserModel,
  UserService,
} from '../../shared/modules/user/index.js';
import {
  CoordinatesModel,
  CoordinatesService,
  DefaultCoordinatesService,
} from '../../shared/modules/coordinates/index.js';
import { Offer } from '../../shared/types/index.js';
import {
  DefaultOfferService,
  OfferModel,
  OfferService,
} from '../../shared/modules/offer/index.js';
import { CommentModel } from '../../shared/modules/comment/index.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private coordinatesService: CoordinatesService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new PinoLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel, CommentModel);
    this.coordinatesService = new DefaultCoordinatesService(
      this.logger,
      CoordinatesModel
    );
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} строк было загружено.`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    const coordinates = await this.coordinatesService.findOrCreate(
      offer.coordinates
    );

    const user = await this.userService.findOrCreate(
      {
        ...offer.author,
        password: DEFAULT_USER_PASSWORD,
      },
      this.salt
    );

    await this.offerService.create({
      name: offer.name,
      description: offer.description,
      publicationDate: offer.publicationDate,
      city: offer.city,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      roomsCount: offer.roomsCount,
      guestsCount: offer.guestsCount,
      price: offer.price,
      features: offer.features,
      author: user.id,
      coordinates: coordinates.id,
      commentsCount: offer.commentsCount
    });
  }

  public async execute(
    filename: string,
    login: string,
    password: string,
    host: string,
    dbname: string,
    salt: string
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);
    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
