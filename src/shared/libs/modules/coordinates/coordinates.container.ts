import { Container } from 'inversify';
import { Component } from '../../../types/index.js';
import { types } from '@typegoose/typegoose';
import { CoordinatesEntity, CoordinatesModel } from './coordinates.entity.js';

export function createCoordinatesContainer() {
  const userContainer = new Container();
  // userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<CoordinatesEntity>>(Component.CoordinatesModel).toConstantValue(CoordinatesModel);

  return userContainer;
}
