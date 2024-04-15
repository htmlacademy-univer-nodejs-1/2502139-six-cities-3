import { City, OfferFeature, OfferType } from '../../../types/index.js';


export class UpdateOfferDto {
  public name?: string;
  public description?: string;
  public publicationDate?: Date;
  public city?: City;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public isFavorite?: boolean;
  public rating?: number;
  public type?: OfferType;
  public roomsCount?: number;
  public guestsCount?: number;
  public price?: number;
  public features?: OfferFeature[];
  public author?: string;
  public commentsCount?: number;
  public coordinates?: string;
}
