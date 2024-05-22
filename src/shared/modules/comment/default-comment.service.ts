import { types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { Logger } from '../../libs/logger/index.js';
import { inject, injectable } from 'inversify';
import { CommentEntity } from './comment.entity.js';
import { OfferService } from '../offer/index.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService)
    private readonly offerService: OfferService
  ) {}

  public async create(
    dto: CreateCommentDto
  ): Promise<types.DocumentType<CommentEntity>> {
    const comment = await (
      await this.commentModel.create(dto)
    ).populate(['user', 'offer']);
    this.logger.info(`Создан новый комментарий: ${dto.comment}`);

    await this.offerService.incCommentCount(comment.offer.id);
    await this.offerService.updateRating(comment.offer.id);

    return comment;
  }

  public async findById(
    commentId: string
  ): Promise<types.DocumentType<CommentEntity> | null> {
    return this.commentModel
      .findById(commentId)
      .populate(['user', 'offer'])
      .exec();
  }

  public async findByAuthorId(
    authorId: string
  ): Promise<types.DocumentType<CommentEntity>[] | null> {
    return this.commentModel
      .find({ user: authorId })
      .populate(['user', 'offer'])
      .exec();
  }

  public async findByOfferId(
    offerId: string
  ): Promise<types.DocumentType<CommentEntity>[] | null> {
    return this.commentModel
      .find({ offer: offerId })
      .populate(['user', 'offer'])
      .exec();
  }

  public async updateById(
    commentId: string,
    dto: UpdateCommentDto
  ): Promise<types.DocumentType<CommentEntity> | null> {
    return this.commentModel
      .findByIdAndUpdate(commentId, dto, { new: true })
      .populate(['user', 'offer'])
      .exec();
  }

  public async deleteById(commentId: string): Promise<types.DocumentType<CommentEntity> | null> {
    const comment = await this.commentModel
      .findByIdAndDelete(commentId, { new: true })
      .populate(['user', 'offer'])
      .exec();

    if (!comment) {
      return null;
    }

    await this.offerService.decCommentCount(comment.offer.id);
    await this.offerService.updateRating(comment.offer.id);

    return comment;
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const comments = await this.commentModel
      .deleteMany({offer: offerId})
      .exec();

    return comments.deletedCount;
  }
}
