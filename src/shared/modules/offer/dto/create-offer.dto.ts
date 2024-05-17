import { OfferGood, OfferType } from '../../../types/index.js';


export class CreateOfferDto {
  public title: string;
  public description: string;
  public publicationDate: Date;
  public city: string;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public price: number;
  public type: OfferType;
  public bedrooms: number;
  public maxAdults: number;
  public goods: OfferGood[];
  public host: string;
  public commentsCount: number;
  public location: string;

}
