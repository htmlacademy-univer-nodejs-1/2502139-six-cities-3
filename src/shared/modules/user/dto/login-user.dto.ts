import { IsEmail, MinLength } from 'class-validator';
import { UserValidationMessages } from './user.messages';

export class LoginUserDto {
  @IsEmail({}, { message: UserValidationMessages.email.url})
  public email: string;

  @MinLength(1, {message: UserValidationMessages.password.login})
  public password: string;
}
