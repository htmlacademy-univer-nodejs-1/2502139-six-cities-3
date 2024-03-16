import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { MockServerData, OfferType, UserType } from '../../types/index.js';
import { OfferGenerator } from './offer-generator.interface.js';

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS_COUNT = 1;
const MAX_ROOMS_COUNT = 8;

const MIN_GUESTS_COUNT = 1;
const MAX_GUESTS_COUNT = 10;

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.name);
    const description = getRandomItem<string>(this.mockData.description);
    const publicationDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem<string>(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomItems<string>(this.mockData.images).join(',');
    const isPremium = getRandomItem<boolean>([true, false]);
    const isFavorite = getRandomItem<boolean>([true, false]);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const type = getRandomItem<OfferType>(Object.values(OfferType));
    const roomsCount = generateRandomValue(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT);
    const guestsCount = generateRandomValue(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const features = getRandomItems(this.mockData.features).join(',');

    const userName = getRandomItem(this.mockData.authors);
    const userEmail = getRandomItem(this.mockData.emails);
    const userAvatar = getRandomItem(this.mockData.avatars);
    const userPassword = getRandomItem(this.mockData.passwords);
    const userType = getRandomItem(Object.values(UserType));

    const commentsCount = generateRandomValue(1, 10);
    const coordinates = getRandomItem(this.mockData.coordinates);

    return [
      name,
      description,
      publicationDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      roomsCount,
      guestsCount,
      price,
      features,
      [userName, userEmail, userAvatar, userPassword, userType].join(','),
      commentsCount,
      coordinates,
    ].join('\t');
  }
}
