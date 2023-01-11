import ErrorException from '@src/utils/exceptions/error.exception';
import { ErrorRequestHandler } from 'express';
import 'dotenv/config';
import { Error } from 'mongoose';
import Joi from 'joi';

const isString = (key: unknown): key is string => typeof key === 'string';

const errorMiddleware: ErrorRequestHandler = (err: ErrorException, req, res, next) => {
  let error = { ...err };

  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }

  let errorObject: Record<string, unknown> = {};

  if (err instanceof Error.ValidationError) {
    Object.keys(err.errors).forEach(key => {
      errorObject[key] = err.errors[key].message;
    });

    error = new ErrorException('Validation failed', 422, errorObject);
  }

  if (err instanceof Joi.ValidationError) {
    err.details.forEach(detail => {
      const key = detail.context?.key;
      if (isString(key)) {
        errorObject[key] = detail.message;
      }
    });

    error = new ErrorException('Validation failed', 422, errorObject);
  }

  res.status(error.statusCode || 500).json({
    message: error.message || err.message || 'Something went wrong',
    error: error.errorObject,
  });
};

export default errorMiddleware;
