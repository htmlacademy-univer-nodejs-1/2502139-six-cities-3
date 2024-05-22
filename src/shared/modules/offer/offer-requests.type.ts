import { Request } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

export type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDto>;
export type CreateOfferCommentRequest = Request<RequestParams, RequestBody, {comment: string, rating: number}>;
export type UpdateOfferRequest = Request<RequestParams, RequestBody, UpdateOfferDto>;
