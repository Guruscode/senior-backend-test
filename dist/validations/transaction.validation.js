"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.historySchema = exports.transferSchema = exports.withdrawSchema = exports.depositSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.depositSchema = joi_1.default.object({
    accountNumber: joi_1.default.string().required().messages({
        'string.empty': 'Account number is required',
        'any.required': 'Account number is required'
    }),
    amount: joi_1.default.number().positive().required().messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be greater than 0',
        'any.required': 'Amount is required'
    }),
    description: joi_1.default.string().optional()
});
exports.withdrawSchema = joi_1.default.object({
    accountNumber: joi_1.default.string().required().messages({
        'string.empty': 'Account number is required',
        'any.required': 'Account number is required'
    }),
    amount: joi_1.default.number().positive().required().messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be greater than 0',
        'any.required': 'Amount is required'
    }),
    description: joi_1.default.string().optional()
});
exports.transferSchema = joi_1.default.object({
    senderAccountNumber: joi_1.default.string().required().messages({
        'string.empty': 'Sender account is required',
        'any.required': 'Sender account is required'
    }),
    receiverAccountNumber: joi_1.default.string().required().messages({
        'string.empty': 'Receiver account is required',
        'any.required': 'Receiver account is required'
    }),
    amount: joi_1.default.number().positive().required().messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be greater than 0',
        'any.required': 'Amount is required'
    }),
    description: joi_1.default.string().optional()
}).custom((value, helpers) => {
    if (value.senderAccountNumber === value.receiverAccountNumber) {
        return helpers.error('any.invalid', {
            message: 'Cannot transfer to the same account'
        });
    }
    return value;
});
exports.historySchema = joi_1.default.object({
    accountNumber: joi_1.default.string().required(),
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10)
});
