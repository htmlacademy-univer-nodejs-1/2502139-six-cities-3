import { CityType } from '../../../types/city.type.js';
import { Coordinates, OfferGood, OfferType } from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: Partial<CityType>;
  public previewImage?: string;
  public isPremium?: boolean;
  public isFavorite?: boolean;
  public type?: OfferType;
  public bedrooms?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: OfferGood[];
  public location?: Partial<Coordinates>;
  public images?: string[];
}
