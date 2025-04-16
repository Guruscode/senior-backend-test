"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.updateAccountBalance = exports.getAccountByNumber = exports.getAccountById = exports.getAccounts = exports.createAccount = void 0;
const account_model_1 = require("../models/account.model");
const apiError_1 = __importDefault(require("../utils/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const generateAccountNumber_1 = require("../utils/generateAccountNumber");
const createAccount = async (accountData) => {
    const accountNumber = (0, generateAccountNumber_1.generateAccountNumber)();
    const account = new account_model_1.AccountModel({
        accountNumber,
        userId: accountData.userId,
        balance: accountData.initialBalance || 0,
        currency: accountData.currency
    });
    return await account.save();
};
exports.createAccount = createAccount;
const getAccounts = async (query) => {
    return await account_model_1.AccountModel.find(query);
};
exports.getAccounts = getAccounts;
const getAccountById = async (id) => {
    return await account_model_1.AccountModel.findById(id);
};
exports.getAccountById = getAccountById;
const getAccountByNumber = async (accountNumber) => {
    return await account_model_1.AccountModel.findOne({ accountNumber });
};
exports.getAccountByNumber = getAccountByNumber;
const updateAccountBalance = async (accountId, amount) => {
    return await account_model_1.AccountModel.findByIdAndUpdate(accountId, { $inc: { balance: amount } }, { new: true });
};
exports.updateAccountBalance = updateAccountBalance;
const deleteAccount = async (id) => {
    const account = await account_model_1.AccountModel.findById(id);
    if (!account) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Account not found');
    }
    if (account.balance !== 0) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot delete account with non-zero balance');
    }
    await account_model_1.AccountModel.findByIdAndDelete(id);
};
exports.deleteAccount = deleteAccount;
