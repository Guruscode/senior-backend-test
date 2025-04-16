"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.getAccount = exports.getUserAccounts = exports.createAccount = void 0;
const account_interface_1 = require("../interfaces/account.interface");
const accountService = __importStar(require("../services/account.service"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("../models/user.model"));
const createAccount = async (req, res, next) => {
    try {
        const { userId, currency } = req.body;
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        // Validate currency
        if (!Object.values(account_interface_1.Currency).includes(currency)) {
            throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid currency');
        }
        const accountData = {
            userId,
            currency
        };
        const account = await accountService.createAccount(accountData);
        res.status(http_status_1.default.CREATED).json(account);
    }
    catch (error) {
        next(error);
    }
};
exports.createAccount = createAccount;
const getUserAccounts = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const accounts = await accountService.getAccounts({ userId });
        res.status(http_status_1.default.OK).json(accounts);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserAccounts = getUserAccounts;
const getAccount = async (req, res, next) => {
    try {
        const { accountNumber } = req.params;
        const account = await accountService.getAccountByNumber(accountNumber);
        if (!account) {
            throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Account not found');
        }
        res.status(http_status_1.default.OK).json(account);
    }
    catch (error) {
        next(error);
    }
};
exports.getAccount = getAccount;
const deleteAccount = async (req, res, next) => {
    try {
        const { accountId } = req.params;
        await accountService.deleteAccount(accountId);
        res.status(http_status_1.default.NO_CONTENT).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAccount = deleteAccount;
