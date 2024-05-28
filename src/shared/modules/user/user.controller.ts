import { inject, injectable } from 'inversify';
import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { UserService } from './user-service.interface.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { StatusCodes } from 'http-status-codes';
import { CheckUserRequest, LoginUserRequest, RegisterUserRequest } from './user-requests.type.js';
import { fillDTO } from '../../helpers/fillDTO.js';
import { UserRdo } from './rdo/user.rdo.js';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { AuthService } from '../auth/index.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService
  ) {
    super(logger);

    this.logger.info('Регистрация путей для контроллера пользователей');

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuth,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
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
    { tokenPayload }: CheckUserRequest,
    res: Response
  ): Promise<void> {
    const existingUser = await this.userService.findByEmail(tokenPayload.email);

    if (!existingUser) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }

    this.ok(res, fillDTO(UserRdo, existingUser));
  }

  public async login(
    { body }: LoginUserRequest,
    _res: Response,
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {
      token,
    });
    _res.cookie('Authorization', `Bearer ${token}`);
    this.ok(_res, responseData);
  }

  public async logout(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Метод не реализован');
  }

  public async register({body}: RegisterUserRequest, _res: Response): Promise<void> {
    const existingUser = await this.userService.findByEmail(body.email);

    if (existingUser) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Пользователь уже существует');
    }

    const newUser = await this.userService.create(body, this.configService.get('SALT'));
    const response = fillDTO(UserRdo, newUser);

    this.created(_res, response);
  }

  public async changeAvatar(req: Request, res: Response): Promise<void> {
    this.created(res, {
      filepath: req.file?.path,
    });
  }
}
