import { Request, Response, NextFunction } from 'express';
import TransactionController from '../../controllers/transaction.controller';
import TransactionService from '../../services/transaction.service';
import ApiResponse from '../../utils/apiResponse';

jest.mock('../../services/transaction.service');
jest.mock('../../utils/apiResponse'); 

describe('TransactionController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  const sendMock = jest.fn();

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    (ApiResponse as any).mockImplementation(() => ({
      send: sendMock,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deposit', () => {
    it('should handle successful deposit', async () => {
      const mockData = { id: 'txn_123', amount: 1000 };
      (TransactionService.deposit as jest.Mock).mockResolvedValue(mockData);

      req.body = {
        accountNumber: '1234567890',
        amount: 1000,
        description: 'Test deposit',
      };

      await TransactionController.deposit(req as Request, res as Response, next);

      expect(TransactionService.deposit).toHaveBeenCalledWith(
        '1234567890',
        1000,
        'Test deposit'
      );

      expect(sendMock).toHaveBeenCalledWith(res);
      expect(ApiResponse).toHaveBeenCalledWith(201, 'Deposit successful', mockData);
    });

    it('should call next() on error', async () => {
      const error = new Error('Something failed');
      (TransactionService.deposit as jest.Mock).mockRejectedValue(error);

      req.body = {
        accountNumber: '1234567890',
        amount: 1000,
        description: 'Test deposit',
      };

      await TransactionController.deposit(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // You can do similar ones for withdraw, transfer, and getHistory:

  describe('withdraw', () => {
    it('should handle successful withdrawal', async () => {
      const mockData = { id: 'txn_456', amount: 500 };
      (TransactionService.withdraw as jest.Mock).mockResolvedValue(mockData);

      req.body = {
        accountNumber: '1234567890',
        amount: 500,
        description: 'ATM withdrawal',
      };

      await TransactionController.withdraw(req as Request, res as Response, next);

      expect(TransactionService.withdraw).toHaveBeenCalledWith(
        '1234567890',
        500,
        'ATM withdrawal'
      );
      expect(ApiResponse).toHaveBeenCalledWith(201, 'Withdrawal successful', mockData);
      expect(sendMock).toHaveBeenCalledWith(res);
    });
  });

  describe('transfer', () => {
    it('should handle successful transfer', async () => {
      const mockData = { id: 'txn_789', amount: 300 };
      (TransactionService.transfer as jest.Mock).mockResolvedValue(mockData);

      req.body = {
        fromAccount: '1234567890',
        toAccount: '0987654321',
        amount: 300,
        description: 'Peer transfer',
      };

      await TransactionController.transfer(req as Request, res as Response, next);

      expect(TransactionService.transfer).toHaveBeenCalledWith(
        '1234567890',
        '0987654321',
        300,
        'Peer transfer'
      );
      expect(ApiResponse).toHaveBeenCalledWith(201, 'Transfer successful', mockData);
      expect(sendMock).toHaveBeenCalledWith(res);
    });
  });

  describe('getHistory', () => {
    it('should handle retrieving transaction history', async () => {
      const mockData = [{ id: 'txn_1' }, { id: 'txn_2' }];
      (TransactionService.getAccountHistory as jest.Mock).mockResolvedValue(mockData);

      req.params = { accountNumber: '1234567890' };
      req.query = { page: '1', limit: '2' };

      await TransactionController.getHistory(req as Request, res as Response, next);

      expect(TransactionService.getAccountHistory).toHaveBeenCalledWith(
        '1234567890',
        1,
        2
      );
      expect(ApiResponse).toHaveBeenCalledWith(200, 'Transaction history retrieved', mockData);
      expect(sendMock).toHaveBeenCalledWith(res);
    });
  });
});
