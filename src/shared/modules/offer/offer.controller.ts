import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
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
import { CommentRdo, CommentService } from '../comment/index.js';

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
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });

    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremium,
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
    });
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.addToFavorite,
    });
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.removeFromFavorite,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.findById,
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.updateById,
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteById,
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.findComments,
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.postComment,
    });


  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const response = fillDTO(OfferRdo, offers);

    this.ok(res, response);
  }

  public async create(_req: CreateOfferRequest, _res: Response): Promise<void> {
    const offer = await this.offerService.create(_req.body);
    const response = fillDTO(OfferRdo, offer);

    this.created(_res, response);
  }

  public async findById({ params }: Request, _res: Response): Promise<void> {
    const offer = await this.offerService.findById(params['offerId']);
    const response = fillDTO(OfferRdo, offer);

    this.ok(_res, response);
  }

  public async updateById(
    { body, params }: UpdateOfferRequest,
    _res: Response
  ): Promise<void> {
    const offer = await this.offerService.updateById(
      <string>params['offerId'],
      body
    );
    const response = fillDTO(OfferRdo, offer);

    this.created(_res, response);
  }

  public async deleteById({ params }: Request, _res: Response): Promise<void> {
    await this.offerService.deleteById(<string>params['offerId']);
    await this.commentService.deleteByOfferId(<string>params['offerId']);

    this.noContent(_res, null);
  }

  public async findComments(_req: Request, _res: Response): Promise<void> {
    const comments =
      (await this.commentService.findByOfferId(_req.params['offerId'])) || [];
    const response = fillDTO(CommentRdo, comments);

    this.ok(_res, response);
  }

  public async postComment(
    { params, body }: CreateOfferCommentRequest,
    _res: Response
  ): Promise<void> {
    const comments = await this.commentService.create({
      ...body,
      offer: <string>params['offerId'],
      user: '6648db24acb6eef6c576c362',
    });
    const response = fillDTO(CommentRdo, comments);

    this.ok(_res, response);
  }

  public async getFavorites(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorite();
    const response = fillDTO(OfferRdo, offers);

    this.ok(res, response);
  }

  public async addToFavorite({params}: Request, res: Response): Promise<void> {
    const offers = await this.offerService.updateById(params['offerId'], {
      isFavorite: true
    });
    const response = fillDTO(OfferRdo, offers);

    this.ok(res, response);
  }

  public async removeFromFavorite({params}: Request, res: Response): Promise<void> {
    const offers = await this.offerService.updateById(params['offerId'], {
      isFavorite: false
    });
    const response = fillDTO(OfferRdo, offers);

    this.ok(res, response);
  }

  public async getPremium(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findPremium();
    const response = fillDTO(OfferRdo, offers);

    this.ok(res, response);
  }
}
