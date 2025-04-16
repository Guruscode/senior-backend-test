import { Request, Response, NextFunction } from 'express';
import TransactionService from '../services/transaction.service';
import ApiResponse from '../utils/apiResponse';

export default class TransactionController {
  static async deposit(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountNumber, amount, description } = req.body;
      const transaction = await TransactionService.deposit(accountNumber, amount, description);
      
      new ApiResponse(201, 'Deposit successful', transaction).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async withdraw(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountNumber, amount, description } = req.body;
      const transaction = await TransactionService.withdraw(accountNumber, amount, description);
      
      new ApiResponse(201, 'Withdrawal successful', transaction).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      const { fromAccount, toAccount, amount, description } = req.body;
      const transaction = await TransactionService.transfer(fromAccount, toAccount, amount, description);
      
      new ApiResponse(201, 'Transfer successful', transaction).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountNumber } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const history = await TransactionService.getAccountHistory(accountNumber, page, limit);
      
      new ApiResponse(200, 'Transaction history retrieved', history).send(res);
    } catch (error) {
      next(error);
    }
  }
}