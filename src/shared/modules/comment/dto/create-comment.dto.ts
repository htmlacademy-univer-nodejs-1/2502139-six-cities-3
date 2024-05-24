import { IsNumber, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CommentValidationMessage } from './comment.messages.js';

export class CreateCommentDto {
  @MinLength(5, {message: CommentValidationMessage.comment.min})
  @MaxLength(1024, {message: CommentValidationMessage.comment.max})
  public comment: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 },
    { message: CommentValidationMessage.rating.invalid }
  )
  @Min(1, { message: CommentValidationMessage.rating.invalidDecimal })
  @Max(5, { message: CommentValidationMessage.rating.invalidDecimal })
  public rating: number;

  // @IsMongoId()
  public user: string;

  public offer: string;
}
