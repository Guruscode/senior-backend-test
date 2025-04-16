import * as AccountService from '../../services/account.service';
import { AccountModel } from '../../models/account.model';
import { generateAccountNumber } from '../../utils/generateAccountNumber';
import ApiError from '../../utils/apiError';
import httpStatus from 'http-status';
import { Currency } from '../../interfaces/account.interface';
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
        currency: 'NGN' as Currency,
      };
      

      const mockAccount = {
        save: jest.fn().mockResolvedValue({
          ...mockAccountData,
          balance: mockAccountData.initialBalance,
          accountNumber: '1234567890',
        }),
      };

      (generateAccountNumber as jest.Mock).mockReturnValue('1234567890');
      (AccountModel as any).mockImplementation(() => mockAccount);

      const result = await AccountService.createAccount(mockAccountData);

      expect(generateAccountNumber).toHaveBeenCalled();
      expect(mockAccount.save).toHaveBeenCalled();
      expect(result.accountNumber).toBe('1234567890');
    });
  });

  describe('getAccounts', () => {
    it('should return list of accounts', async () => {
      const mockAccounts = [{ accountNumber: '123', balance: 100 }];
      (AccountModel.find as jest.Mock).mockResolvedValue(mockAccounts);

      const result = await AccountService.getAccounts({});

      expect(AccountModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockAccounts);
    });
  });

  describe('getAccountById', () => {
    it('should return an account by ID', async () => {
      const mockAccount = { accountNumber: '123' };
      (AccountModel.findById as jest.Mock).mockResolvedValue(mockAccount);

      const result = await AccountService.getAccountById('some-id');

      expect(AccountModel.findById).toHaveBeenCalledWith('some-id');
      expect(result).toEqual(mockAccount);
    });
  });

  describe('getAccountByNumber', () => {
    it('should return an account by number', async () => {
      const mockAccount = { accountNumber: '123' };
      (AccountModel.findOne as jest.Mock).mockResolvedValue(mockAccount);

      const result = await AccountService.getAccountByNumber('123');

      expect(AccountModel.findOne).toHaveBeenCalledWith({ accountNumber: '123' });
      expect(result).toEqual(mockAccount);
    });
  });

  describe('updateAccountBalance', () => {
    it('should update account balance', async () => {
      const updatedAccount = { accountNumber: '123', balance: 200 };
      (AccountModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedAccount);

      const result = await AccountService.updateAccountBalance('acc-id', 100);

      expect(AccountModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'acc-id',
        { $inc: { balance: 100 } },
        { new: true }
      );
      expect(result).toEqual(updatedAccount);
    });
  });

  describe('deleteAccount', () => {
    it('should throw error if account not found', async () => {
      (AccountModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(AccountService.deleteAccount('some-id')).rejects.toThrow(ApiError);
    });

    it('should throw error if balance is not zero', async () => {
      const account = { balance: 500 };
      (AccountModel.findById as jest.Mock).mockResolvedValue(account);

      await expect(AccountService.deleteAccount('some-id')).rejects.toThrow(ApiError);
    });

    it('should delete account if balance is zero', async () => {
      const account = { balance: 0 };
      (AccountModel.findById as jest.Mock).mockResolvedValue(account);
      (AccountModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await AccountService.deleteAccount('some-id');

      expect(AccountModel.findByIdAndDelete).toHaveBeenCalledWith('some-id');
    });
  });
});
