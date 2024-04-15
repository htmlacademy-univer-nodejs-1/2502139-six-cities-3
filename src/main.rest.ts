import 'reflect-metadata';
import { Container } from 'inversify';
import {
  RestApplication,
  createRestApplicationContainer,
} from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createCoordinatesContainer } from './shared/modules/coordinates/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';

async function bootstrap() {
  const diContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createCoordinatesContainer(),
    createOfferContainer(),
    createCommentContainer()
  );

  const application = diContainer.get<RestApplication>(
    Component.RestApplication
  );
  await application.init();
}

bootstrap();
