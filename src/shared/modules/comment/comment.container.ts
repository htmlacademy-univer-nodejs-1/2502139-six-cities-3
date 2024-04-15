import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { types } from '@typegoose/typegoose';
import { CommentService } from './comment-service.interface.js';
import { DefaultCommentService } from './default-comment.service.js';
import { CommentEntity, CommentModel } from './comment.entity.js';

export function createCommentContainer() {
  const userContainer = new Container();
  userContainer.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  userContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

  return userContainer;
}
