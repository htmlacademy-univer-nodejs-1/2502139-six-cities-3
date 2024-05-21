import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { UserService } from './user-service.interface.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { StatusCodes } from 'http-status-codes';
import { CheckUserRequest } from './user-requests.type.js';
import { fillDTO } from '../../helpers/fillDTO.js';
import { UserRdo } from './rdo/user.rdo.js';
import { Response } from 'express';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Регистрация путей для контроллера пользователей');

    this.addRoute({path: '/login', method: HttpMethod.Get, handler: this.checkAuth});
    this.addRoute({path: '/login', method: HttpMethod.Post, handler: this.login});
    this.addRoute({path: '/logout', method: HttpMethod.Get, handler: this.logout});
    this.addRoute({path: '/register', method: HttpMethod.Get, handler: this.register});
    this.addRoute({path: '/avatar', method: HttpMethod.Post, handler: this.changeAvatar});
  }

  public async checkAuth({ body: { email }}: CheckUserRequest, res: Response): Promise<void> {
    const existingUser = await this.userService.findByEmail(email);

    if (!existingUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
      );
    }

    this.ok(res, fillDTO(UserRdo, existingUser));
  }

  public async login(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Метод не реализован');
  }

  public async logout(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Метод не реализован');
  }

  public async register(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Метод не реализован');
  }

  public async changeAvatar(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Метод не реализован');
  }
}
