import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { OfferType } from '../../../types/index.js';
import { UserEntity } from '../user/user.entity.js';


export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, type: String })
  public name: string;

  @prop({ required: true, type: String })
  public description: string;

  @prop({ required: true, type: Date })
  public publicationDate: Date;

  @prop({ required: true, type: String })
  public city: string;

  @prop({ required: true, type: String })
  public previewImage: string;

  @prop({ type: Array<string>, required: true, default: [] })
  public images: string[];

  @prop({ required: true, type: Boolean })
  public isPremium: boolean;

  @prop({ required: true, type: Boolean })
  public isFavorite: boolean;

  @prop({ required: true, type: Number })
  public rating: number;

  @prop({ required: true, type: String, enum: OfferType })
  public type: OfferType;

  @prop({ required: true, type: Number })
  public roomsCount: number;

  @prop({ required: true, type: Number })
  public guestsCount: number;

  @prop({ required: true, type: Array })
  public features: string[];

  @prop({ required: true, ref: UserEntity, type: UserEntity, _id: false })
  public authorId: Ref<UserEntity>;

  @prop({ required: true, type: Number, default: () => 0 })
  public commentsCount: number;
}

export const OfferModel = getModelForClass(OfferEntity);
