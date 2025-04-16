import express from 'express';
import * as accountController from '../controllers/account.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware'; // Correct import
import { createAccountSchema } from '../validations/account.validation';

const router = express.Router();

router.post(
  '/',
  authenticate,
  validateBody(createAccountSchema), // Use validateBody
  accountController.createAccount
);

router.get(
  '/user/:userId',
  authenticate,
  accountController.getUserAccounts
);

router.get(
  '/:accountNumber',
  authenticate,
  accountController.getAccount
);

router.delete(
  '/:accountId',
  authenticate,
  accountController.deleteAccount
);

export default router;