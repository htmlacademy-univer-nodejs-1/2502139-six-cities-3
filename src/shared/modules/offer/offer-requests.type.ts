import { Request } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CreateCommentDto } from '../comment/index.js';

export type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDto>;
export type CreateOfferCommentRequest = Request<RequestParams, RequestBody, CreateCommentDto>;
export type UpdateOfferRequest = Request<RequestParams, RequestBody, UpdateOfferDto>;
