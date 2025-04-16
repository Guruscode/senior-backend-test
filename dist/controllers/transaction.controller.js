"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionValidations = void 0;
const transaction_service_1 = __importDefault(require("../services/transaction.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const transaction_validation_1 = require("../validations/transaction.validation");
const validation_middleware_1 = require("../middlewares/validation.middleware");
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
            const { page, limit } = req.query;
            const history = await transaction_service_1.default.getAccountHistory(accountNumber, parseInt(page) || 1, parseInt(limit) || 10);
            new apiResponse_1.default(200, 'Transaction history retrieved', history).send(res);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = TransactionController;
// Export the validation middlewares for route definitions
exports.transactionValidations = {
    deposit: (0, validation_middleware_1.validateBody)(transaction_validation_1.depositSchema), // Use validateBody
    withdraw: (0, validation_middleware_1.validateBody)(transaction_validation_1.withdrawSchema), // Use validateBody
    transfer: (0, validation_middleware_1.validateBody)(transaction_validation_1.transferSchema), // Use validateBody
    history: (0, validation_middleware_1.validateParams)(transaction_validation_1.historySchema), // Keep validateParams
};
