import { IsMongoId } from 'class-validator';

export class DeleteFavoriteDto {
  @IsMongoId({})
  public user: string;

  @IsMongoId({})
  public offer: string;
}
