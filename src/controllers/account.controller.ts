import { Request, Response, NextFunction } from 'express';
import { IAccount, ICreateAccount, Currency } from '../interfaces/account.interface';
import * as accountService from '../services/account.service';
import ApiError from '../utils/apiError';
import httpStatus from 'http-status';
import UserModel from '../models/user.model';

export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, currency } = req.body;
    

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    
    // Validate currency
    if (!Object.values(Currency).includes(currency)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid currency');
    }
    
    const accountData: ICreateAccount = {
      userId,
      currency
    };
    
    const account = await accountService.createAccount(accountData);
    res.status(httpStatus.CREATED).json(account);
  } catch (error) {
    next(error);
  }
};

export const getUserAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const accounts = await accountService.getAccounts({ userId });
    res.status(httpStatus.OK).json(accounts);
  } catch (error) {
    next(error);
  }
};

export const getAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountNumber } = req.params;
    const account = await accountService.getAccountByNumber(accountNumber);
    
    if (!account) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
    }
    
    res.status(httpStatus.OK).json(account);
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountId } = req.params;
    await accountService.deleteAccount(accountId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};