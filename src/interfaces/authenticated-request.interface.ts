import { Request } from 'express';
import { Document } from 'mongoose';
import { IUser } from '../models/user.model';

export interface AuthenticatedRequest extends Request {
  user?: Document<unknown, {}, IUser> & IUser;
}