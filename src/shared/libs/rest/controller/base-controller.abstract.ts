import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Response, Router } from 'express';
import { Controller } from './controller.interface.js';
import { Logger } from '../../logger/index.js';
import { Route } from '../types/route.interface.js';
import expressAsyncHandler from 'express-async-handler';
import { Component } from '../../../types/index.js';
import { PathTransformer } from '../transform/path-transformer.js';

const DEFAULT_CONTENT_TYPE = 'application/json';

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router: Router;

  @inject(Component.PathTransformer)
  private pathTranformer: PathTransformer;

  constructor(
    protected readonly logger: Logger
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: Route) {
    const wrapperAsyncHandler = expressAsyncHandler(route.handler.bind(this));
    const middlewareHandlers = route.middlewares?.map(
      (item) => expressAsyncHandler(item.execute.bind(item))
    );
    const allHandlers = middlewareHandlers ? [...middlewareHandlers, wrapperAsyncHandler] : wrapperAsyncHandler;

    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Зарегистрирован путь: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    const modifiedData = this.pathTranformer.execute(data as Record<string, unknown>);
    res
      .type(DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(modifiedData);
  }

  // 200+
  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  // 400+
  public badRequest<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.BAD_REQUEST, data);
  }

  public unauthorized<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.UNAUTHORIZED, data);
  }

  public forbidden<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.FORBIDDEN, data);
  }

  public notFound<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NOT_FOUND, data);
  }

  // 500+
  public notImplemented<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NOT_IMPLEMENTED, data);
  }

  public serviceUnavailable<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.SERVICE_UNAVAILABLE, data);
  }
}
