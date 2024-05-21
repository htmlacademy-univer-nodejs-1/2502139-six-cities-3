import { Request } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { CheckUserDto } from './dto/check-user.dto.js';

export type CheckUserRequest = Request<
  RequestParams,
  RequestBody,
  CheckUserDto
>;
export type LoginUserRequest = Request<
  RequestParams,
  RequestBody,
  LoginUserDto
>;
