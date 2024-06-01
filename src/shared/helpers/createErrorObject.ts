import { ApplicationError, ValidationErrorField } from '../libs/rest/index.js';

export function createErrorObject(errorType: ApplicationError, error: string, details: ValidationErrorField[] = []) {
  return { errorType, error, details };
}
