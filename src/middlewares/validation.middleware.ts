import { Request, Response, NextFunction, RequestHandler } from 'express'; 
import Joi from 'joi';
import ApiError from '../utils/apiError';

export const validateBody = (schema: Joi.ObjectSchema): RequestHandler => { 
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
      }));
      return next(new ApiError(400, 'Validation error', errors));
    }
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.query, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => ({
                message: detail.message,
                path: detail.path,
            }));
            return next(new ApiError(400, 'Validation error', errors));
        }
        next();
    };
};

export const validateParams = (schema: Joi.ObjectSchema): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.params, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => ({
                message: detail.message,
                path: detail.path,
            }));
            return next(new ApiError(400, 'Validation error', errors));
        }
        next();
    };
};