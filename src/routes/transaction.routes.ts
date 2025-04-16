import { Router } from 'express';
import TransactionController, { transactionValidations } from '../controllers/transaction.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/deposit', 
  authenticate, 
  transactionValidations.deposit, 
  TransactionController.deposit
);

router.post(
  '/withdraw', 
  authenticate, 
  transactionValidations.withdraw, 
  TransactionController.withdraw
);

router.post(
  '/transfer', 
  authenticate, 
  transactionValidations.transfer, 
  TransactionController.transfer
);

router.get(
  '/history/:accountNumber', 
  authenticate, 
  transactionValidations.history, 
  TransactionController.getHistory
);

export default router;