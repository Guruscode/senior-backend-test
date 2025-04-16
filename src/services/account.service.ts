import { IAccount, ICreateAccount, IAccountQuery, Currency } from '../interfaces/account.interface';
import { AccountModel } from '../models/account.model';
import ApiError from '../utils/apiError';
import httpStatus from 'http-status';
import { generateAccountNumber } from '../utils/generateAccountNumber';

export const createAccount = async (accountData: ICreateAccount): Promise<IAccount> => {
  const accountNumber = generateAccountNumber();
  
  const account = new AccountModel({
    accountNumber,
    userId: accountData.userId,
    balance: accountData.initialBalance || 0,
    currency: accountData.currency
  });

  return await account.save();
};

export const getAccounts = async (query: IAccountQuery): Promise<IAccount[]> => {
  return await AccountModel.find(query);
};

export const getAccountById = async (id: string): Promise<IAccount | null> => {
  return await AccountModel.findById(id);
};

export const getAccountByNumber = async (accountNumber: string): Promise<IAccount | null> => {
  return await AccountModel.findOne({ accountNumber });
};

export const updateAccountBalance = async (
  accountId: string,
  amount: number
): Promise<IAccount | null> => {
  return await AccountModel.findByIdAndUpdate(
    accountId,
    { $inc: { balance: amount } },
    { new: true }
  );
};

export const deleteAccount = async (id: string): Promise<void> => {
  const account = await AccountModel.findById(id);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  
  if (account.balance !== 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot delete account with non-zero balance');
  }
  
  await AccountModel.findByIdAndDelete(id);
};