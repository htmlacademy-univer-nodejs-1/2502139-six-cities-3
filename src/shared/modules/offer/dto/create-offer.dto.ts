import { CityType } from '../../../types/city.type.js';
import { Coordinates, OfferGood, OfferType } from '../../../types/index.js';


export class CreateOfferDto {
  public title: string;
  public description: string;
  public city: CityType;
  public previewImage: string;
  public isPremium: boolean;
  public type: OfferType;
  public bedrooms: number;
  public maxAdults: number;
  public price: number;
  public goods: OfferGood[];
  public location: Coordinates;
  public images: string[];
}
