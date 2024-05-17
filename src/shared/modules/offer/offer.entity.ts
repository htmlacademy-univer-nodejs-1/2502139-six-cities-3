import { PropType, Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { City, OfferGood, OfferType } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';
import { CoordinatesEntity } from '../coordinates/index.js';


export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, type: String })
  public title: string;

  @prop({ required: true, type: String })
  public description: string;

  @prop({ required: true, type: Date })
  public publicationDate: Date;

  @prop({ required: true, type: String, enum: City })
  public city: string;

  @prop({ required: true, type: String })
  public previewImage: string;

  @prop({ type: () => [String], required: true}, PropType.ARRAY)
  public images: string[];

  @prop({ required: true, type: Boolean })
  public isPremium: boolean;

  @prop({ required: true, type: Boolean })
  public isFavorite: boolean;

  @prop({ required: true, type: Number })
  public rating: number;

  @prop({ required: true, type: Number })
  public price: number;

  @prop({ required: true, type: String, enum: OfferType })
  public type: OfferType;

  @prop({ required: true, type: Number })
  public bedrooms: number;

  @prop({ required: true, type: Number })
  public maxAdults: number;

  @prop({ required: true, type: () => [String], enum: OfferGood }, PropType.ARRAY)
  public goods: string[];

  @prop({ required: true, ref: UserEntity })
  public host: Ref<UserEntity>;

  @prop({ required: true, type: Number, default: () => 0 })
  public commentsCount: number;

  @prop({ required: true, ref: CoordinatesEntity })
  public location: Ref<CoordinatesEntity>;
}

export const OfferModel = getModelForClass(OfferEntity);
