import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { OfferEntity } from '../offer/index.js';

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
  },
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, type: String })
  public comment: string;

  @prop({required: true, type: Date, default: Date() })
  public date: string;

  @prop({required: true, type: Number })
  public rating: number;

  @prop({required: true, ref: UserEntity})
  public user: Ref<UserEntity>;

  @prop({required: true, ref: OfferEntity})
  public offer: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
