import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserType } from '../../../types/index.js';
import { UserValidationMessages } from './user.messages.js';

export class UpdateUserDto {
  @MinLength(1, { message: UserValidationMessages.name.min })
  @MaxLength(15, { message: UserValidationMessages.name.max })
  @IsOptional()
  public name: string;

  @IsEmail({}, { message: UserValidationMessages.email.url })
  @IsOptional()
  public email: string;

  @IsOptional()
  @IsUrl({}, { message: UserValidationMessages.avatarUrl.url })
  public avatarUrl?: string;

  @MinLength(6, { message: UserValidationMessages.password.min })
  @MaxLength(12, { message: UserValidationMessages.password.max })
  @IsOptional()
  public password: string;

  @IsEnum(UserType, { message: UserValidationMessages.type.type })
  @IsOptional()
  public type: UserType;
}
