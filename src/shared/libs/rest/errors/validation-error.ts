import { StatusCodes } from 'http-status-codes';
import { ValidationError as VError } from 'class-validator';
import { ClassConstructor } from 'class-transformer';

export class ValidationError extends Error {
  public httpStatusCode: number;
  public dtoName: string;
  public details?: VError[] = [];

  constructor(dto: ClassConstructor<object>, message: string, details?: VError[]) {
    super(message);

    this.httpStatusCode = StatusCodes.BAD_REQUEST;
    this.dtoName = dto.name;
    this.message = message;
    this.details = details;
  }
}
