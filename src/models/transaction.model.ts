import { Schema, model, Document } from 'mongoose';
import  TransactionType  from '../interfaces/transaction.interface';

export interface ITransaction extends Document {
  reference: string;
  amount: number;
  type: TransactionType;
  status: 'pending' | 'completed' | 'failed';
  senderAccount?: string; 
  receiverAccount?: string; 
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    reference: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['CREDIT','DEPOSIT','WITHDRAWAL', 'DEBIT', 'TRANSFER'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    senderAccount: { type: String },
    receiverAccount: { type: String },
    description: { type: String }
  },
  { timestamps: true }
);

export default model<ITransaction>('Transaction', TransactionSchema);