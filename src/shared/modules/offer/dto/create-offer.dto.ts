import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { City, OfferGood, OfferType } from '../../../types/index.js';
import { OfferValidationMessage } from './offer.messages.js';

export class CreateOfferDto {
  @MinLength(10, { message: OfferValidationMessage.title.minLength })
  @MaxLength(100, { message: OfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20, {
    message: OfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: OfferValidationMessage.description.maxLength,
  })
  public description: string;

  @IsDateString(
    {},
    { message: OfferValidationMessage.postDate.invalidFormat }
  )
  public publicationDate: Date;

  @IsEnum(City, { message: OfferValidationMessage.city.invalid })
  public city: City;

  @IsUrl({}, { message: OfferValidationMessage.previewImage.invalid })
  public previewImage: string;

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
  public images: string[];

  @IsBoolean({ message: OfferValidationMessage.isPremium.invalid })
  public isPremium: boolean;

  @IsBoolean({ message: OfferValidationMessage.isFavorite.invalid })
  public isFavorite: boolean;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 },
    { message: OfferValidationMessage.rating.invalid }
  )
  @Min(1, { message: OfferValidationMessage.rating.invalidDecimal })
  @Max(5, { message: OfferValidationMessage.rating.invalidDecimal })
  public rating: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 },
    { message: OfferValidationMessage.price.invalid }
  )
  @Min(100, { message: OfferValidationMessage.price.invalidDecimal })
  @Max(100000, { message: OfferValidationMessage.price.invalidDecimal })
  public price: number;

  @IsEnum(OfferType, { message: OfferValidationMessage.type.invalid })
  public type: OfferType;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 },
    { message: OfferValidationMessage.bedrooms.invalid }
  )
  @Min(1, { message: OfferValidationMessage.bedrooms.invalidDecimal })
  @Max(8, {
    message: OfferValidationMessage.bedrooms.invalidDecimal,
  })
  public bedrooms: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 },
    { message: OfferValidationMessage.maxAdults.invalid }
  )
  @Min(1, { message: OfferValidationMessage.maxAdults.invalidDecimal })
  @Max(10, {
    message: OfferValidationMessage.maxAdults.invalidDecimal,
  })
  public maxAdults: number;

  @IsEnum(OfferGood, {
    each: true,
    message: OfferValidationMessage.goods.invalid,
  })
  public goods: OfferGood[];

  // @IsMongoId({})
  public host: string;

  @IsLatitude({ message: OfferValidationMessage.latitude.invalid })
  public latitude: number;

  @IsLongitude({ message: OfferValidationMessage.longitude.invalid })
  public longitude: number;
}
