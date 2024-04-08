import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from './shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from './shared/libs/database-client/index.js';

async function bootstrap() {
  const diContainer = new Container();

  diContainer
    .bind<RestApplication>(Component.RestApplication)
    .to(RestApplication)
    .inSingletonScope();
  diContainer
    .bind<Logger>(Component.Logger)
    .to(PinoLogger)
    .inSingletonScope();
  diContainer
    .bind<Config<RestSchema>>(Component.Config)
    .to(RestConfig)
    .inSingletonScope();
  diContainer
    .bind<DatabaseClient>(Component.DatabaseClient)
    .to(MongoDatabaseClient)
    .inSingletonScope();

  const application = diContainer.get<RestApplication>(
    Component.RestApplication
  );
  await application.init();
}

bootstrap();
