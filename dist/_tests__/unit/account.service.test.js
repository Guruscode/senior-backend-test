"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AccountService = __importStar(require("../../services/account.service"));
const account_model_1 = require("../../models/account.model");
const generateAccountNumber_1 = require("../../utils/generateAccountNumber");
const apiError_1 = __importDefault(require("../../utils/apiError"));
jest.mock('../../models/account.model');
jest.mock('../../utils/generateAccountNumber');
describe('Account Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('createAccount', () => {
        it('should create and return a new account', async () => {
            const mockAccountData = {
                userId: 'user123',
                initialBalance: 1000,
                currency: 'NGN',
            };
            const mockAccount = {
                save: jest.fn().mockResolvedValue({
                    ...mockAccountData,
                    balance: mockAccountData.initialBalance,
                    accountNumber: '1234567890',
                }),
            };
            generateAccountNumber_1.generateAccountNumber.mockReturnValue('1234567890');
            account_model_1.AccountModel.mockImplementation(() => mockAccount);
            const result = await AccountService.createAccount(mockAccountData);
            expect(generateAccountNumber_1.generateAccountNumber).toHaveBeenCalled();
            expect(mockAccount.save).toHaveBeenCalled();
            expect(result.accountNumber).toBe('1234567890');
        });
    });
    describe('getAccounts', () => {
        it('should return list of accounts', async () => {
            const mockAccounts = [{ accountNumber: '123', balance: 100 }];
            account_model_1.AccountModel.find.mockResolvedValue(mockAccounts);
            const result = await AccountService.getAccounts({});
            expect(account_model_1.AccountModel.find).toHaveBeenCalledWith({});
            expect(result).toEqual(mockAccounts);
        });
    });
    describe('getAccountById', () => {
        it('should return an account by ID', async () => {
            const mockAccount = { accountNumber: '123' };
            account_model_1.AccountModel.findById.mockResolvedValue(mockAccount);
            const result = await AccountService.getAccountById('some-id');
            expect(account_model_1.AccountModel.findById).toHaveBeenCalledWith('some-id');
            expect(result).toEqual(mockAccount);
        });
    });
    describe('getAccountByNumber', () => {
        it('should return an account by number', async () => {
            const mockAccount = { accountNumber: '123' };
            account_model_1.AccountModel.findOne.mockResolvedValue(mockAccount);
            const result = await AccountService.getAccountByNumber('123');
            expect(account_model_1.AccountModel.findOne).toHaveBeenCalledWith({ accountNumber: '123' });
            expect(result).toEqual(mockAccount);
        });
    });
    describe('updateAccountBalance', () => {
        it('should update account balance', async () => {
            const updatedAccount = { accountNumber: '123', balance: 200 };
            account_model_1.AccountModel.findByIdAndUpdate.mockResolvedValue(updatedAccount);
            const result = await AccountService.updateAccountBalance('acc-id', 100);
            expect(account_model_1.AccountModel.findByIdAndUpdate).toHaveBeenCalledWith('acc-id', { $inc: { balance: 100 } }, { new: true });
            expect(result).toEqual(updatedAccount);
        });
    });
    describe('deleteAccount', () => {
        it('should throw error if account not found', async () => {
            account_model_1.AccountModel.findById.mockResolvedValue(null);
            await expect(AccountService.deleteAccount('some-id')).rejects.toThrow(apiError_1.default);
        });
        it('should throw error if balance is not zero', async () => {
            const account = { balance: 500 };
            account_model_1.AccountModel.findById.mockResolvedValue(account);
            await expect(AccountService.deleteAccount('some-id')).rejects.toThrow(apiError_1.default);
        });
        it('should delete account if balance is zero', async () => {
            const account = { balance: 0 };
            account_model_1.AccountModel.findById.mockResolvedValue(account);
            account_model_1.AccountModel.findByIdAndDelete.mockResolvedValue(null);
            await AccountService.deleteAccount('some-id');
            expect(account_model_1.AccountModel.findByIdAndDelete).toHaveBeenCalledWith('some-id');
        });
    });
});
