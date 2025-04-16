"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_service_1 = __importDefault(require("../services/transaction.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
class TransactionController {
    static async deposit(req, res, next) {
        try {
            const { accountNumber, amount, description } = req.body;
            const transaction = await transaction_service_1.default.deposit(accountNumber, amount, description);
            new apiResponse_1.default(201, 'Deposit successful', transaction).send(res);
        }
        catch (error) {
            next(error);
        }
    }
    static async withdraw(req, res, next) {
        try {
            const { accountNumber, amount, description } = req.body;
            const transaction = await transaction_service_1.default.withdraw(accountNumber, amount, description);
            new apiResponse_1.default(201, 'Withdrawal successful', transaction).send(res);
        }
        catch (error) {
            next(error);
        }
    }
    static async transfer(req, res, next) {
        try {
            const { fromAccount, toAccount, amount, description } = req.body;
            const transaction = await transaction_service_1.default.transfer(fromAccount, toAccount, amount, description);
            new apiResponse_1.default(201, 'Transfer successful', transaction).send(res);
        }
        catch (error) {
            next(error);
        }
    }
    static async getHistory(req, res, next) {
        try {
            const { accountNumber } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const history = await transaction_service_1.default.getAccountHistory(accountNumber, page, limit);
            new apiResponse_1.default(200, 'Transaction history retrieved', history).send(res);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = TransactionController;
