import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Coordinates } from '../../types';

export interface CoordinatesEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'coordinates'
  }
})
export class CoordinatesEntity extends defaultClasses.TimeStamps implements Coordinates {
  @prop({required: true, type: Number})
  public latitude: number;

  @prop({required: true, type: Number})
  public longitude: number;

  constructor(userData: Coordinates) {
    super();

    this.latitude = userData.latitude;
    this.longitude = userData.longitude;
  }
}

export const CoordinatesModel = getModelForClass(CoordinatesEntity);
