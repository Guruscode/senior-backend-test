import ITransaction from '../interfaces/transaction.interface';
import Transaction from '../models/transaction.model';
import LedgerEntry from '../models/ledgerEntry.model';
import { AccountModel } from '../models/account.model';
import ApiError from '../utils/apiError';
import { generateTransactionReference } from '../utils/transactionReference';

export default class TransactionService {
  /**
   * Record a deposit (CREDIT)
   */
  static async deposit(accountNumber: string, amount: number, description?: string): Promise<ITransaction> {
    const account = await AccountModel.findOne({ accountNumber });
    if (!account) throw new ApiError(404, 'Account not found');
  
    let reference: string;
    let transactionDoc: any = null;
  
    for (let i = 0; i < 5; i++) {
      try {
        reference = generateTransactionReference();
  
        transactionDoc = new Transaction({
          reference,
          amount,
          type: 'DEPOSIT',
          status: 'pending',
          receiverAccount: accountNumber,
          description
        });
  
        await transactionDoc.save(); // Save the actual Mongoose document
        break;
      } catch (err: any) {
        if (err.code === 11000 && err.message.includes('reference')) {
          continue; // retry on duplicate reference
        }
        throw err;
      }
    }
  
    if (!transactionDoc) {
      throw new Error('Failed to create transaction after multiple attempts');
    }
  
    const balanceBefore = account.balance;
    account.balance += amount;
    await account.save();
  
    const ledgerEntry = new LedgerEntry({
      transactionReference: transactionDoc.reference,
      reference: transactionDoc.reference,
      accountId: account._id.toString(),
      amount,
      currency: account.currency,
      type: 'DEPOSIT',
      balanceBefore,
      balanceAfter: account.balance
    });
  
    await ledgerEntry.save();
  
    return transactionDoc;
  }
  /**
   * Record a withdrawal (DEBIT)
   */
  static async withdraw(accountNumber: string, amount: number, description?: string): Promise<ITransaction> {
    const account = await AccountModel.findOne({ accountNumber });
    if (!account) throw new ApiError(404, 'Account not found');
    if (account.balance < amount) throw new ApiError(400, 'Insufficient funds');
  
    // Create transaction record
    const transaction = new Transaction({
      reference: generateTransactionReference(),
      amount,
      type: 'WITHDRAWAL',
      status: 'pending',
      senderAccount: accountNumber,
      description
    });
  
    // Update account balance
    const balanceBefore = account.balance;
    account.balance -= amount;
    await account.save();
  
    // Create ledger entry with required fields
    const ledgerEntry = new LedgerEntry({
      transactionReference: transaction.reference,
      reference: transaction.reference, 
      accountId: account._id.toString(), 
      amount,
      currency: account.currency, 
      type: 'WITHDRAWAL', 
      balanceBefore,
      balanceAfter: account.balance
    });
  
    // Save transaction and ledger entry
    await Promise.all([
      transaction.save(),
      ledgerEntry.save()
    ]);
  
    return transaction;
  }
  

  /**
   * Transfer between accounts
   */
  static async transfer(
    senderAccountNumber: string,
    receiverAccountNumber: string,
    amount: number,
    description?: string
  ): Promise<ITransaction> {
    if (senderAccountNumber === receiverAccountNumber) {
      throw new ApiError(400, 'Cannot transfer to the same account');
    }

    const [senderAccount, receiverAccount] = await Promise.all([
      AccountModel.findOne({ accountNumber: senderAccountNumber }),
      AccountModel.findOne({ accountNumber: receiverAccountNumber })
    ]);

    if (!senderAccount || !receiverAccount) {
      throw new ApiError(404, 'One or both accounts not found');
    }
    if (senderAccount.balance < amount) {
      throw new ApiError(400, 'Insufficient funds');
    }

    // Create transaction record
    const transaction = new Transaction({
      reference: generateTransactionReference(),
      amount,
      type: 'TRANSFER',
      status: 'pending',
      senderAccount: senderAccountNumber,
      receiverAccount: receiverAccountNumber,
      description
    });

    // Update balances
    const senderBalanceBefore = senderAccount.balance;
    senderAccount.balance -= amount;

    const receiverBalanceBefore = receiverAccount.balance;
    receiverAccount.balance += amount;

    // Create ledger entries
    const senderLedgerEntry = new LedgerEntry({
      transactionReference: transaction.reference,
      account: senderAccountNumber,
      amount,
      type: 'DEBIT',
      balanceBefore: senderBalanceBefore,
      balanceAfter: senderAccount.balance
    });

    const receiverLedgerEntry = new LedgerEntry({
      transactionReference: transaction.reference,
      account: receiverAccountNumber,
      amount,
      type: 'CREDIT',
      balanceBefore: receiverBalanceBefore,
      balanceAfter: receiverAccount.balance
    });

    // Save all records
    await Promise.all([
      transaction.save(),
      senderAccount.save(),
      receiverAccount.save(),
      senderLedgerEntry.save(),
      receiverLedgerEntry.save()
    ]);

    return transaction;
  }

  /**
   * Get transaction history for an account
   */
  static async getAccountHistory(accountNumber: string, page = 1, limit = 10) {
    const account = await AccountModel.findOne({ accountNumber });
    if (!account) throw new ApiError(404, 'Account not found');

    const skip = (page - 1) * limit;

    const [ledgerEntries, total] = await Promise.all([
      LedgerEntry.find({ account: accountNumber })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      LedgerEntry.countDocuments({ account: accountNumber })
    ]);

    return {
      data: ledgerEntries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
