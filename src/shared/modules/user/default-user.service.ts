import { UserService } from './user-service.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { inject } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`Создан повый пользователь ${result}`);

    return result;
  }

  public findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ id }).exec();
  }

  public findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email }).exec();
  }

  public async findOrCreate(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async updateById(
    id: string,
    dto: UpdateUserDto
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  public async updateByEmail(
    email: string,
    dto: UpdateUserDto
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findOneAndUpdate({ email }, dto, { new: true })
      .exec();
  }

  public async deleteById(
    id: string
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  public async deleteByEmail(
    email: string
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOneAndDelete({ email }).exec();
  }
}
