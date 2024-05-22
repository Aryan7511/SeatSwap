import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError  {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid Requests Parameters');
    //Only because we are extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    const formattedErrors = this.errors.map((err) => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path };
      }
      return { message: 'Validation error', field: 'Unknown' };
    });
    return formattedErrors;
  }
}

/*export class RequestValidationError extends Error {
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super();
    this.errors = errors;
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
} */
