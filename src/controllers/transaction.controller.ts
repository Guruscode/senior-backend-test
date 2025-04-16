import { Request, Response, NextFunction } from 'express';
import TransactionService from '../services/transaction.service';
import ApiResponse from '../utils/apiResponse';
import { 
  depositSchema, 
  withdrawSchema, 
  transferSchema, 
  historySchema 
} from '../validations/transaction.validation';
import { validateBody, validateParams } from '../middlewares/validation.middleware';


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
      const { page, limit } = req.query;
      
      const history = await TransactionService.getAccountHistory(
        accountNumber, 
        parseInt(page as string) || 1, 
        parseInt(limit as string) || 10
      );
      
      new ApiResponse(200, 'Transaction history retrieved', history).send(res);
    } catch (error) {
      next(error);
    }
  }
}

// Export the validation middlewares for route definitions
export const transactionValidations = {
  deposit: validateBody(depositSchema), // Use validateBody
  withdraw: validateBody(withdrawSchema), // Use validateBody
  transfer: validateBody(transferSchema), // Use validateBody
  history: validateParams(historySchema), // Keep validateParams
};