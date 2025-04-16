import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import ApiError from '../utils/apiError';
import { HttpStatusCode } from 'axios';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ApiError(HttpStatusCode.Unauthorized, 'No token provided');
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      throw new ApiError(HttpStatusCode.Unauthorized, 'User not found');
    }

    console.log('User from middleware:', user); // Inspect the user object
    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    next(error);
  }
};
