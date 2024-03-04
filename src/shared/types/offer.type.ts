import { OfferType } from './offer-type.enum';
import { OfferFeature } from './offer-feature.enum';
import { Coordinates } from './coordinates.type';
import { User } from './user.type';

export type Offer = {
  name: string,
  description: string,
  publicationDate: Date,
  city: string,
  previewImage: string,
  images: string[],
  isPremium: boolean,
  isFavorite: boolean,
  rating: number,
  type: OfferType,
  roomsCount: number,
  guestsCount: number,
  price: number,
  features: OfferFeature[],
  author: User,
  commentsCount: number,
  coordinates: Coordinates
}
