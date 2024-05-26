import {
  Ref,
  defaultClasses,
  getModelForClass,
  index,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { OfferEntity } from '../offer/index.js';

export interface FavoriteEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'favorites',
  },
})
@index({ user: 1, offer: 1 }, { unique: true })
export class FavoriteEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, ref: UserEntity })
  public user: Ref<UserEntity>;

  @prop({ required: true, ref: OfferEntity })
  public offer: Ref<OfferEntity>;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
