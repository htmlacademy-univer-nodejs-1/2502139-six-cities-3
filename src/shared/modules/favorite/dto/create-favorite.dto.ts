import { IsMongoId } from 'class-validator';

export class CreateFavoriteDto {
  @IsMongoId({})
  public user: string;

  @IsMongoId({})
  public offer: string;
}
