import { IsEmail } from 'class-validator';
import { UserValidationMessages } from './user.messages';

export class CheckUserDto {
  @IsEmail({}, {message: UserValidationMessages.email.url})
  public email: string;
}
