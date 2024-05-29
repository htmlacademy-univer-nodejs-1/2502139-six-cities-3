import { inject, injectable } from 'inversify';
import { FavoriteService } from './favorite-service.interface.js';
import { Component } from '../../types/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { OfferEntity } from '../offer';
import { DeleteFavoriteDto } from './dto/delete-favorite.dto.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import mongoose from 'mongoose';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.FavoriteModel)
    private readonly favoriteModel: types.ModelType<FavoriteEntity>,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async index(
    userId: string
  ): Promise<types.DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel.aggregate([
      {
        $lookup: {
          from: 'favorites',
          localField: '_id',
          foreignField: 'offer',
          as: 'favoriteOffer',
        },
      },
      {
        $unwind: {
          path: '$favoriteOffer',
        },
      },
      {
        $match: {
          'favoriteOffer.user': new mongoose.Types.ObjectId(userId),
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
      {
        $unwind: {
          path: '$host',
        },
      },
      { $unset: 'favoriteOffer' },
      {
        $set: {
          isFavorite: true,
        },
      },
    ]);

    return offers;
  }

  public async find(
    userId: string,
    offerId: string
  ): Promise<types.DocumentType<OfferEntity> | null> {
    const favorite = await this.favoriteModel.findOne({
      user: new mongoose.Types.ObjectId(userId),
      offer: new mongoose.Types.ObjectId(offerId),
    });

    if (!favorite) {
      return null;
    }

    const offer = await this.offerModel
      .findById(favorite.offer._id)
      .set({ isFavorite: true });

    return offer;
  }

  public async create(
    dto: CreateFavoriteDto
  ): Promise<types.DocumentType<OfferEntity> | null> {
    const oldOffer = await this.find(dto.user, dto.offer);

    if (oldOffer) {
      return null;
    }

    await this.favoriteModel.create(dto);
    const newOffer = await this.find(dto.user, dto.offer);

    return newOffer;
  }

  public async delete(
    dto: DeleteFavoriteDto
  ): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.find(dto.user, dto.offer);

    if (!offer) {
      return null;
    }

    await this.favoriteModel.deleteOne(dto);

    return offer;
  }
}
