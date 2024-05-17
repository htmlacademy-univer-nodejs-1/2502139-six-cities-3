import { OfferType } from './offer-type.enum';
import { OfferGood as OfferGood } from './offer-good.enum';
import { Coordinates } from './coordinates.type';
import { User } from './user.type';
import { City } from './city.enum';

export type Offer = {
  title: string,
  description: string,
  publicationDate: Date,
  city: City,
  previewImage: string,
  images: string[],
  isPremium: boolean,
  isFavorite: boolean,
  rating: number,
  type: OfferType,
  bedrooms: number,
  maxAdults: number,
  price: number,
  goods: OfferGood[],
  host: User,
  commentsCount: number,
  location: Coordinates
}
