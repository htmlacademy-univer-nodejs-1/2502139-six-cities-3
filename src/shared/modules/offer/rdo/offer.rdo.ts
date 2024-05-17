import { Expose } from 'class-transformer';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public price: number;

  @Expose()
  public rating: number;

  @Expose()
  public name: string;
}
