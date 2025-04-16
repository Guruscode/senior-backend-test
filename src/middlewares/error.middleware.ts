import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/apiError';
import logger from '../config/logger';
import { HttpStatusCode } from 'axios';

const errorMiddleware = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    logger.error(err.message);
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  logger.error(err.stack || err.message);
  res.status(HttpStatusCode.InternalServerError).json({
    success: false,
    message: 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorMiddleware;