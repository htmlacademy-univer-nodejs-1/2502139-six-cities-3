import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CommentEntity } from '../comment/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = (await this.offerModel.create(dto)).populate([
      'author',
      'coordinates',
    ]);
    this.logger.info(`Создан новый оффер: ${dto.name}`);

    return result;
  }

  public async findById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['author', 'coordinates'])
      .exec();
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().populate(['author', 'coordinates']).exec();
  }

  public async deleteById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .populate(['author', 'coordinates'])
      .exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['author', 'coordinates'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async incCommentCount(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentsCount: 1,
        },
      })
      .populate(['author', 'coordinates'])
      .exec();
  }

  public async decCommentCount(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentsCount: -1,
        },
      })
      .populate(['author', 'coordinates'])
      .exec();
  }

  public async findNew(count: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .sort({ createdAt: SortType.Down })
      .limit(count)
      .populate(['author', 'coordinates'])
      .exec();
  }

  public async findDiscussed(
    count: number
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .sort({ commentsCount: SortType.Down })
      .limit(count)
      .populate(['userId', 'categories'])
      .exec();
  }

  public async updateRating(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    const rating = (await this.commentModel.find({offer: offerId}))?.reduce(
      (avg, comment, _, { length }) => avg + comment.rating / length,
      0
    ).toFixed(1);

    if (!rating) {
      return null;
    }

    return await this.offerModel.findByIdAndUpdate(offerId, { rating });
  }
}
