import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, type: String })
  public name: string;

  @prop({ required: true, type: String, unique: true })
  public email: string;

  @prop({ required: false, type: String, default: () => 'https://api.multiavatar.com/kathrin.svg' })
  public avatarUrl?: string;

  @prop({ required: true, type: String })
  public password: string;

  @prop({required: true, type: String, enum: UserType})
  public type: UserType;

  constructor(userData: CreateUserDto) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
