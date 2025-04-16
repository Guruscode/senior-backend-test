export enum Currency {
  NGN = 'NGN',
  USD = 'USD'
}

export interface IAccount {
  id: string;
  accountNumber: string;
  userId: string;
  balance: number;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateAccount {
  userId: string;
  currency: Currency;
  initialBalance?: number;
}

export interface IAccountQuery {
  userId?: string;
  accountNumber?: string;
  currency?: Currency;
}