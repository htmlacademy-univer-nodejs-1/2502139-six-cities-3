import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { City, OfferGood, OfferType } from '../../../types/index.js';
import { OfferValidationMessage } from './offer.messages.js';

export class UpdateOfferDto {
  @MinLength(10, { message: OfferValidationMessage.title.minLength })
  @MaxLength(100, { message: OfferValidationMessage.title.maxLength })
  @IsOptional()
  public title?: string;

  @MinLength(20, {
    message: OfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: OfferValidationMessage.description.maxLength,
  })
  @IsOptional()
  public description?: string;

  @IsDateString(
    {},
    { message: OfferValidationMessage.postDate.invalidFormat }
  )
  @IsOptional()
  public publicationDate?: Date;

  @IsEnum(City, { message: OfferValidationMessage.city.invalid })
  @IsOptional()
  public city?: City;

  @IsUrl({}, { message: OfferValidationMessage.previewImage.invalid })
  @IsOptional()
  public previewImage?: string;

  @ArrayMinSize(6, {
    message: OfferValidationMessage.images.invalidLength,
  })
  @ArrayMaxSize(6, {
    message: OfferValidationMessage.images.invalidLength,
  })
  @IsUrl(
    {},
    {
      each: true,
      message: OfferValidationMessage.images.someImageInvalid,
    }
  )
  @IsOptional()
  public images?: string[];

  @IsBoolean({ message: OfferValidationMessage.isPremium.invalid })
  @IsOptional()
  public isPremium?: boolean;

  @IsBoolean({ message: OfferValidationMessage.isFavorite.invalid })
  @IsOptional()
  public isFavorite?: boolean;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 },
    { message: OfferValidationMessage.rating.invalid }
  )
  @Min(1, { message: OfferValidationMessage.rating.invalidDecimal })
  @Max(5, { message: OfferValidationMessage.rating.invalidDecimal })
  @IsOptional()
  public rating?: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 },
    { message: OfferValidationMessage.price.invalid }
  )
  @Min(100, { message: OfferValidationMessage.price.invalidDecimal })
  @Max(100000, { message: OfferValidationMessage.price.invalidDecimal })
  @IsOptional()
  public price?: number;

  @IsEnum(OfferType, { message: OfferValidationMessage.type.invalid })
  @IsOptional()
  public type?: OfferType;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 },
    { message: OfferValidationMessage.bedrooms.invalid }
  )
  @Min(1, { message: OfferValidationMessage.bedrooms.invalidDecimal })
  @Max(8, {
    message: OfferValidationMessage.bedrooms.invalidDecimal,
  })
  @IsOptional()
  public bedrooms?: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 },
    { message: OfferValidationMessage.maxAdults.invalid }
  )
  @Min(1, { message: OfferValidationMessage.maxAdults.invalidDecimal })
  @Max(10, {
    message: OfferValidationMessage.maxAdults.invalidDecimal,
  })
  @IsOptional()
  public maxAdults?: number;

  @IsEnum(OfferGood, {
    each: true,
    message: OfferValidationMessage.goods.invalid,
  })
  @IsOptional()
  public goods?: OfferGood[];

  @IsMongoId({})
  @IsOptional()
  public host?: string;

  @IsLatitude({ message: OfferValidationMessage.latitude.invalid })
  @IsOptional()
  public latitude?: number;

  @IsLongitude({ message: OfferValidationMessage.longitude.invalid })
  @IsOptional()
  public longitude?: number;
}
