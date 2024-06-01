import { Expose, Transform } from 'class-transformer';
import { UserType } from '../../../types/index.js';

export class UserRdo {
  @Expose({name: '_id'})
  @Transform(({obj}) => obj._id.toString())
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public avatarUrl: string;

  @Expose()
  public type: UserType;
}
