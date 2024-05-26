import { inject, injectable } from 'inversify';
import { FavoriteService } from './favorite-service.interface.js';
import { Component } from '../../types/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { OfferEntity } from '../offer';
import { DeleteFavoriteDto } from './dto/delete-favorite.dto.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async index(
    userId: string
  ): Promise<types.DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel.aggregate([
      {
        $lookup: {
          from: 'favorites',
          localField: 'id',
          foreignField: 'offer',
          as: 'favoriteOffer'
        },
      },
      {
        $unwind: {
          path: '$favoriteOffer'
        }
      },
      {
        $match: {
          'favoriteOffer.user': userId
        }
      },
      { $unset: 'favoriteOffer' },
      { $set: {
        isFavorite: true
      }}
    ]);

    return offers;
  }

  public async find(userId: string, offerId: string): Promise<types.DocumentType<OfferEntity> | null> {
    const favorite = await this.favoriteModel.findOne({ user: userId, offer: offerId });

    const offer = await this.offerModel.findById(favorite?.offer).set({ isFavorite: true });

    return offer;
  }

  public async create(dto: CreateFavoriteDto): Promise<types.DocumentType<OfferEntity> | null> {
    const oldOffer = await this.find(dto.user, dto.offer);

    if (oldOffer) {
      return null;
    }

    await this.favoriteModel.create(dto);
    const newOffer = await this.find(dto.user, dto.offer);

    return newOffer;
  }

  public async delete(dto: DeleteFavoriteDto): Promise<DocumentType<OfferEntity> | null> {
    const oldOffer = await this.find(dto.user, dto.offer);

    if (!oldOffer) {
      return null;
    }

    await this.favoriteModel.deleteOne(dto);
    const newOffer = await this.offerModel.findOne({ id: dto.offer, host: dto.user });

    return newOffer;
  }
}
