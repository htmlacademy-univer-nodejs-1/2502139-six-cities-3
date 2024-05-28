import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from '../offer/offer.entity.js';
import { DeleteFavoriteDto } from './dto/delete-favorite.dto.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';

export interface FavoriteService {
  index(userId: string): Promise<DocumentType<OfferEntity>[]>;
  find(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null>;
  create(dto: CreateFavoriteDto): Promise<DocumentType<OfferEntity> | null>;
  delete(dto: DeleteFavoriteDto): Promise<DocumentType<OfferEntity> | null>;
}
