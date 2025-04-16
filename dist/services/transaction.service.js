"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const ledgerEntry_model_1 = __importDefault(require("../models/ledgerEntry.model"));
const account_model_1 = require("../models/account.model");
const apiError_1 = __importDefault(require("../utils/apiError"));
const transactionReference_1 = require("../utils/transactionReference");
class TransactionService {
    /**
     * Record a deposit (CREDIT)
     */
    static async deposit(accountNumber, amount, description) {
        const account = await account_model_1.AccountModel.findOne({ accountNumber });
        if (!account)
            throw new apiError_1.default(404, 'Account not found');
        let reference;
        let transactionDoc = null;
        for (let i = 0; i < 5; i++) {
            try {
                reference = (0, transactionReference_1.generateTransactionReference)();
                transactionDoc = new transaction_model_1.default({
                    reference,
                    amount,
                    type: 'DEPOSIT',
                    status: 'pending',
                    receiverAccount: accountNumber,
                    description
                });
                await transactionDoc.save(); // Save the actual Mongoose document
                break;
            }
            catch (err) {
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
        const ledgerEntry = new ledgerEntry_model_1.default({
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
    static async withdraw(accountNumber, amount, description) {
        const account = await account_model_1.AccountModel.findOne({ accountNumber });
        if (!account)
            throw new apiError_1.default(404, 'Account not found');
        if (account.balance < amount)
            throw new apiError_1.default(400, 'Insufficient funds');
        // Create transaction record
        const transaction = new transaction_model_1.default({
            reference: (0, transactionReference_1.generateTransactionReference)(),
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
        const ledgerEntry = new ledgerEntry_model_1.default({
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
    static async transfer(senderAccountNumber, receiverAccountNumber, amount, description) {
        if (senderAccountNumber === receiverAccountNumber) {
            throw new apiError_1.default(400, 'Cannot transfer to the same account');
        }
        const [senderAccount, receiverAccount] = await Promise.all([
            account_model_1.AccountModel.findOne({ accountNumber: senderAccountNumber }),
            account_model_1.AccountModel.findOne({ accountNumber: receiverAccountNumber })
        ]);
        if (!senderAccount || !receiverAccount) {
            throw new apiError_1.default(404, 'One or both accounts not found');
        }
        if (senderAccount.balance < amount) {
            throw new apiError_1.default(400, 'Insufficient funds');
        }
        // Create transaction record
        const transaction = new transaction_model_1.default({
            reference: (0, transactionReference_1.generateTransactionReference)(),
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
        const senderLedgerEntry = new ledgerEntry_model_1.default({
            transactionReference: transaction.reference,
            account: senderAccountNumber,
            amount,
            type: 'DEBIT',
            balanceBefore: senderBalanceBefore,
            balanceAfter: senderAccount.balance
        });
        const receiverLedgerEntry = new ledgerEntry_model_1.default({
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
    static async getAccountHistory(accountNumber, page = 1, limit = 10) {
        const account = await account_model_1.AccountModel.findOne({ accountNumber });
        if (!account)
            throw new apiError_1.default(404, 'Account not found');
        const skip = (page - 1) * limit;
        const [ledgerEntries, total] = await Promise.all([
            ledgerEntry_model_1.default.find({ account: accountNumber })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            ledgerEntry_model_1.default.countDocuments({ account: accountNumber })
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
exports.default = TransactionService;
