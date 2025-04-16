import Joi from 'joi';
import { Currency } from '../interfaces/account.interface';



export const createAccountSchema = Joi.object({
  userId: Joi.string().required(),
  currency: Joi.string()
    .valid(...Object.values(Currency))
    .required(),
  accountName: Joi.string().optional(), // Adding optional name field.
  accountType: Joi.string().valid('savings', 'checking', 'investment').optional(), //adding optional account type.
  initialBalance: Joi.number().min(0).optional()//adding optional initial balance.
});

export const accountNumberSchema = Joi.object({
  accountNumber: Joi.string().required()
});

export const accountIdSchema = Joi.object({
  accountId: Joi.string().required()
});