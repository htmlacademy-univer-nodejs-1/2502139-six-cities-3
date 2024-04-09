import 'reflect-metadata';
import { Container } from 'inversify';
import {
  RestApplication,
  createRestApplicationContainer,
} from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createUserContainer } from './shared/libs/modules/user/index.js';

async function bootstrap() {
  const diContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer()
  );

  const application = diContainer.get<RestApplication>(
    Component.RestApplication
  );
  await application.init();
}

bootstrap();
