import Joi from 'joi';

export const depositSchema = Joi.object({
  accountNumber: Joi.string().required().messages({
    'string.empty': 'Account number is required',
    'any.required': 'Account number is required'
  }),
  amount: Joi.number().positive().required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be greater than 0',
    'any.required': 'Amount is required'
  }),
  description: Joi.string().optional()
});

export const withdrawSchema = Joi.object({
  accountNumber: Joi.string().required().messages({
    'string.empty': 'Account number is required',
    'any.required': 'Account number is required'
  }),
  amount: Joi.number().positive().required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be greater than 0',
    'any.required': 'Amount is required'
  }),
  description: Joi.string().optional()
});

export const transferSchema = Joi.object({
  senderAccountNumber: Joi.string().required().messages({
    'string.empty': 'Sender account is required',
    'any.required': 'Sender account is required'
  }),
  receiverAccountNumber: Joi.string().required().messages({
    'string.empty': 'Receiver account is required',
    'any.required': 'Receiver account is required'
  }),
  amount: Joi.number().positive().required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be greater than 0',
    'any.required': 'Amount is required'
  }),
  description: Joi.string().optional()
}).custom((value, helpers) => {
  if (value.senderAccountNumber === value.receiverAccountNumber) {
    return helpers.error('any.invalid', {
      message: 'Cannot transfer to the same account'
    });
  }
  return value;
});


export const historySchema = Joi.object({
  accountNumber: Joi.string().required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});