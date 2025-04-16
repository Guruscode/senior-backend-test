"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountIdSchema = exports.accountNumberSchema = exports.createAccountSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const account_interface_1 = require("../interfaces/account.interface");
exports.createAccountSchema = joi_1.default.object({
    userId: joi_1.default.string().required(),
    currency: joi_1.default.string()
        .valid(...Object.values(account_interface_1.Currency))
        .required(),
    accountName: joi_1.default.string().optional(), // Adding optional name field.
    accountType: joi_1.default.string().valid('savings', 'checking', 'investment').optional(), //adding optional account type.
    initialBalance: joi_1.default.number().min(0).optional() //adding optional initial balance.
});
exports.accountNumberSchema = joi_1.default.object({
    accountNumber: joi_1.default.string().required()
});
exports.accountIdSchema = joi_1.default.object({
    accountId: joi_1.default.string().required()
});
