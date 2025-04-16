import { model, Schema } from 'mongoose';
import { IAccount, Currency } from '../interfaces/account.interface';

const AccountSchema = new Schema<IAccount>(
  {
    accountNumber: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, enum: Object.values(Currency), required: true }
  },
  { timestamps: true }
);

export const AccountModel = model<IAccount>('Account', AccountSchema);