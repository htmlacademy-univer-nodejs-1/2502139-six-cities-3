import { Coordinates, Offer, OfferFeature, OfferType, User, UserType } from '../types/index.js';
import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .reduce((offers: Offer[], line: string, index) => {
        if (line.trim().length === 0 || !index) {
          return offers;
        }

        const [name, description, publicationDate, city, previewImage, images, isPremium, isFavorite, rating, type, roomsCount, guestsCount, price, features, author, commentsCount, coordinates] = line.split('\t');

        const offer: Offer = {
          name,
          description,
          publicationDate: new Date(publicationDate),
          city,
          previewImage,
          images: images.split(','),
          isPremium: isPremium === 'true',
          isFavorite: isFavorite === 'true',
          rating: Number(rating),
          type: OfferType[type as OfferType],
          roomsCount: Number(roomsCount),
          guestsCount: Number(guestsCount),
          price: Number(price),
          features: features.split(',').map((feature) => OfferFeature[feature as OfferFeature]),
          author: author.split(',').reduce((user: User, value, authorIndex) => {
            const key = (['name', 'email', 'avatar', 'password', 'type'] as const)[authorIndex];

            if (key === 'type') {
              user[key] = UserType[value as UserType];
            } else {
              user[key] = value;
            }

            return user;
          }, {} as User),
          commentsCount: Number(commentsCount),
          coordinates: coordinates.split(',').reduce((coords, value, coordsIndex) => {
            const key = (['latitude', 'longitude'] as const)[coordsIndex];

            coords[key] = Number(value);

            return coords;
          }, {} as Coordinates)
        };

        offers.push(offer);

        return offers;
      }, []);
  }
}
