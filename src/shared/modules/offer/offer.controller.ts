import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import {
  CreateOfferCommentRequest,
  CreateOfferRequest,
  UpdateOfferRequest,
} from './offer-requests.type.js';
import {
  CommentRdo,
  CommentService,
  CreateCommentDto,
} from '../comment/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService)
    private readonly commentService: CommentService
  ) {
    super(logger);

    this.logger.info('Регистрация путей для контроллера предложений');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateOfferDto),
        new PrivateRouteMiddleware(),
      ],
    });

    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.indexPremium,
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.indexFavorite,
    });
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.updateFavorite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.showById,
      middlewares: [
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.updateById,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteById,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.indexComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.createComment,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const limit = Number(_req.query.limit) || undefined;
    const offers = await this.offerService.find(limit);
    const response = fillDTO(OfferRdo, offers);

    this.ok(res, response);
  }

  public async create(_req: CreateOfferRequest, _res: Response): Promise<void> {
    const offer = await this.offerService.create({
      ..._req.body,
      host: _req.tokenPayload.id,
    });
    const response = fillDTO(OfferRdo, offer);

    this.created(_res, response);
  }

  public async showById({ params }: Request, _res: Response): Promise<void> {
    const offer = await this.offerService.findById(params['offerId']);
    const response = fillDTO(OfferRdo, offer);

    this.ok(_res, response);
  }

  public async updateById(
    { body, params, tokenPayload }: UpdateOfferRequest,
    _res: Response
  ): Promise<void> {
    const offerId = <string>params['offerId'];
    const oldOffer = await this.offerService.findById(offerId);

    if (oldOffer?.host.id !== tokenPayload.id) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Forbidden');
    }

    const offer = await this.offerService.updateById(offerId, body);
    const response = fillDTO(OfferRdo, offer);

    this.created(_res, response);
  }

  public async deleteById({ params, tokenPayload }: Request, _res: Response): Promise<void> {
    const offerId = <string>params['offerId'];
    const oldOffer = await this.offerService.findById(offerId);

    if (oldOffer?.host.id !== tokenPayload.id) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Forbidden');
    }

    await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);

    this.noContent(_res, null);
  }

  public async indexComments(_req: Request, _res: Response): Promise<void> {
    const comments =
      (await this.commentService.findByOfferId(_req.params['offerId'])) || [];
    const response = fillDTO(CommentRdo, comments);

    this.ok(_res, response);
  }

  public async createComment(
    { params, body, tokenPayload }: CreateOfferCommentRequest,
    _res: Response
  ): Promise<void> {
    const comments = await this.commentService.create({
      ...body,
      user: tokenPayload.id,
      offer: <string>params['offerId'],
    });
    const response = fillDTO(CommentRdo, comments);

    this.ok(_res, response);
  }

  public async indexFavorite(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorite();
    const response = fillDTO(OfferRdo, offers);

    this.ok(res, response);
  }

  public async updateFavorite(
    { params }: Request,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.updateById(params['offerId'], {
      isFavorite: true,
    });
    const response = fillDTO(OfferRdo, offers);

    this.ok(res, response);
  }

  public async deleteFavorite(
    { params }: Request,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.updateById(params['offerId'], {
      isFavorite: false,
    });
    const response = fillDTO(OfferRdo, offers);

    this.ok(res, response);
  }

  public async indexPremium(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findPremium();
    const response = fillDTO(OfferRdo, offers);

    this.ok(res, response);
  }
}
