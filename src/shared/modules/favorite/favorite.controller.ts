import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, PrivateRouteMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../helpers/fillDTO.js';
import { OfferRdo, OfferService } from '../offer/index.js';
import { FavoriteService } from './favorite-service.interface.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.FavoriteService) private readonly favoriteService: FavoriteService,
  ) {
    super(logger);

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.indexFavorite,
      middlewares: [ new PrivateRouteMiddleware() ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.updateFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async indexFavorite(_req: Request, res: Response): Promise<void> {
    const offers = await this.favoriteService.index(_req.tokenPayload.id);
    const response = fillDTO(OfferRdo, offers);

    this.ok(res, response);
  }

  public async updateFavorite(
    { params, tokenPayload }: Request,
    res: Response
  ): Promise<void> {
    const offerId = params['offerId'];
    const offer = await this.favoriteService.create({
      offer: offerId,
      user: tokenPayload.id
    });

    if (!offer) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Предложение уже в избранном');
    }

    const response = fillDTO(OfferRdo, offer);

    this.ok(res, response);
  }

  public async deleteFavorite(
    { params, tokenPayload }: Request,
    res: Response
  ): Promise<void> {
    const offerId = params['offerId'];
    const offer = await this.favoriteService.create({
      offer: offerId,
      user: tokenPayload.id
    });

    if (!offer) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Предложение уже не в избранном');
    }

    const response = fillDTO(OfferRdo, offer);

    this.ok(res, response);
  }
}
