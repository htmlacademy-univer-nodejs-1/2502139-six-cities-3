import { Expose, Transform, Type } from 'class-transformer';
import { City, Coordinates, OfferGood, OfferType } from '../../../types/index.js';
import { UserRdo } from '../../user/index.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public price: number;

  @Expose()
  public rating: number;

  @Expose()
  public title: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  @Transform(({obj, value}) => {
    const {latitude, longitude} = obj;

    const result = {
      name: value,
      location: {
        latitude,
        longitude
      }
    };

    return result;
  })
  public city: City;

  @Expose()
  @Transform(({obj}) => {
    const {latitude, longitude} = obj;

    return {
      latitude,
      longitude
    };
  })
  public location: Coordinates;

  @Expose()
  public previewImage: string;

  @Expose()
  public type: OfferType;

  @Expose()
  public bedrooms: number;

  @Expose()
  public description: string;

  @Expose()
  public goods: OfferGood[];

  @Expose()
  @Type(() => UserRdo)
  public host: UserRdo;

  @Expose()
  public images: string[];

  @Expose()
  public maxAdults: number;
}
