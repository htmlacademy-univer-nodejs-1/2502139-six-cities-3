import { DocumentType, types } from '@typegoose/typegoose';
import { Component, SortType } from '../../types/index.js';
import { inject, injectable } from 'inversify';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { CommentEntity } from '../comment/index.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { Logger } from '../../libs/logger/index.js';
import {
  DEFAULT_OFFER_COUNT,
  DEFAULT_PREMIUM_OFFER_COUNT,
} from './offer.constant.js';
import mongoose from 'mongoose';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = (await this.offerModel.create(dto)).populate(['host']);
    this.logger.info(`Создан новый оффер: ${dto.title}`);

    return result;
  }

  public async findById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['host']).exec();
  }

  public async find(
    limit?: number,
    userId?: string
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        {
          $lookup: {
            let: {
              offerId: '$_id',
            },
            from: 'favorites',
            as: 'favs',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$offer', '$$offerId'],
                  },
                },
              },
              {
                $match: {
                  $expr: {
                    $eq: ['$user', new mongoose.Types.ObjectId(userId)],
                  },
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'users',
            as: 'host',
            localField: 'host',
            foreignField: '_id',
          },
        },
        { $unwind: { path: '$favs', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$host', preserveNullAndEmptyArrays: true } },
        {
          $set: {
            isFavorite: {
              $cond: {
                if: {
                  $lte: ['$favs', null],
                },
                then: false,
                else: true,
              },
            },
          },
        },
        { $project: { favs: 0 } },
        { $limit: limit || DEFAULT_OFFER_COUNT },
      ])
      .sort({ publicationDate: SortType.Down })
      .exec();
  }

  public async deleteById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).populate(['host']).exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['host'])
      .exec();
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: offerId })) !== null;
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
      .populate(['host'])
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
      .populate(['host'])
      .exec();
  }

  public async updateRating(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    const rating = (await this.commentModel.find({ offer: offerId }))
      ?.reduce(
        (avg, comment, _, { length }) => avg + comment.rating / length,
        0
      )
      .toFixed(1);

    if (!rating) {
      return null;
    }

    return await this.offerModel.findByIdAndUpdate(offerId, { rating });
  }

  public async findFavorite(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().populate(['host']).exec();
  }

  public async findPremium(
    city?: string,
    limit?: number
  ): Promise<DocumentType<OfferEntity>[]> {
    const query: {
      isPremium: true;
      limit?: number;
      city?: string;
    } = { isPremium: true };
    if (city) {
      query.city = city;
    }
    if (limit) {
      query.limit = limit;
    }

    return this.offerModel
      .find(query)
      .sort({ publicationDate: SortType.Down })
      .limit(limit || DEFAULT_PREMIUM_OFFER_COUNT)
      .populate(['host'])
      .exec();
  }
}
