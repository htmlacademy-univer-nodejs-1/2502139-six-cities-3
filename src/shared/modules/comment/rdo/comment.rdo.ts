import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/index.js';

export class CommentRdo {
  @Expose()
  public id: string;

  @Expose()
  public rating: number;

  @Expose()
  public comment: string;

  @Expose()
  public date: string;

  @Expose()
  @Type(() => UserRdo)
  public user: UserRdo;
}
