import { Coordinates, OfferFeature, OfferType } from '../../../../types/index.js';


export class CreateOfferDto {
  public name: string;
  public description: string;
  public publicationDate: Date;
  public city: string;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: OfferType;
  public roomsCount: number;
  public guestsCount: number;
  public price: number;
  public features: OfferFeature[];
  public authorId: string;
  public commentsCount: number;
  public coordinates: Coordinates;

}
