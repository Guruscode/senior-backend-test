import { Schema, model, Document } from 'mongoose';
import { Currency } from '../interfaces/account.interface';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER'
}
export interface ILedgerEntry extends Document {
  transactionReference: string;
  accountId: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  reference: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: Date;
}

const LedgerEntrySchema = new Schema<ILedgerEntry>(
  {
    transactionReference: { type: String, required: true },
    accountId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: Object.values(Currency), required: true },
    type: { type: String, enum: Object.values(TransactionType), required: true },
    reference: { type: String, required: true },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true }
  },
  { timestamps: true }
);

// Index for faster queries on account history
LedgerEntrySchema.index({ account: 1, createdAt: -1 });

export default model<ILedgerEntry>('LedgerEntry', LedgerEntrySchema);