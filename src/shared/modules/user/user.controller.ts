import { inject, injectable } from 'inversify';
import {
  BaseController,
  HttpError,
  HttpMethod,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { UserService } from './user-service.interface.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { StatusCodes } from 'http-status-codes';
import { CheckUserRequest } from './user-requests.type.js';
import { fillDTO } from '../../helpers/fillDTO.js';
import { UserRdo } from './rdo/user.rdo.js';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto.js';
import { CheckUserDto } from './dto/check-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { Config, RestSchema } from '../../libs/config/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>
  ) {
    super(logger);

    this.logger.info('Регистрация путей для контроллера пользователей');

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuth,
      middlewares: [new ValidateDtoMiddleware(CheckUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Get,
      handler: this.logout,
    });
    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.register,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.changeAvatar,
      middlewares: [
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'avatar'
        ),
      ],
    });
  }

  public async checkAuth(
    { body: { email } }: CheckUserRequest,
    res: Response
  ): Promise<void> {
    const existingUser = await this.userService.findByEmail(email);

    if (!existingUser) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
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

  public async changeAvatar(req: Request, res: Response): Promise<void> {
    this.created(res, {
      filepath: req.file?.path,
    });
  }
}
