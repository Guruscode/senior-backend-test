"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_controller_1 = __importDefault(require("../../controllers/transaction.controller"));
const transaction_service_1 = __importDefault(require("../../services/transaction.service"));
const apiResponse_1 = __importDefault(require("../../utils/apiResponse"));
jest.mock('../../services/transaction.service');
jest.mock('../../utils/apiResponse');
describe('TransactionController', () => {
    let req;
    let res;
    let next;
    const sendMock = jest.fn();
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        apiResponse_1.default.mockImplementation(() => ({
            send: sendMock,
        }));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('deposit', () => {
        it('should handle successful deposit', async () => {
            const mockData = { id: 'txn_123', amount: 1000 };
            transaction_service_1.default.deposit.mockResolvedValue(mockData);
            req.body = {
                accountNumber: '1234567890',
                amount: 1000,
                description: 'Test deposit',
            };
            await transaction_controller_1.default.deposit(req, res, next);
            expect(transaction_service_1.default.deposit).toHaveBeenCalledWith('1234567890', 1000, 'Test deposit');
            expect(sendMock).toHaveBeenCalledWith(res);
            expect(apiResponse_1.default).toHaveBeenCalledWith(201, 'Deposit successful', mockData);
        });
        it('should call next() on error', async () => {
            const error = new Error('Something failed');
            transaction_service_1.default.deposit.mockRejectedValue(error);
            req.body = {
                accountNumber: '1234567890',
                amount: 1000,
                description: 'Test deposit',
            };
            await transaction_controller_1.default.deposit(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
    // You can do similar ones for withdraw, transfer, and getHistory:
    describe('withdraw', () => {
        it('should handle successful withdrawal', async () => {
            const mockData = { id: 'txn_456', amount: 500 };
            transaction_service_1.default.withdraw.mockResolvedValue(mockData);
            req.body = {
                accountNumber: '1234567890',
                amount: 500,
                description: 'ATM withdrawal',
            };
            await transaction_controller_1.default.withdraw(req, res, next);
            expect(transaction_service_1.default.withdraw).toHaveBeenCalledWith('1234567890', 500, 'ATM withdrawal');
            expect(apiResponse_1.default).toHaveBeenCalledWith(201, 'Withdrawal successful', mockData);
            expect(sendMock).toHaveBeenCalledWith(res);
        });
    });
    describe('transfer', () => {
        it('should handle successful transfer', async () => {
            const mockData = { id: 'txn_789', amount: 300 };
            transaction_service_1.default.transfer.mockResolvedValue(mockData);
            req.body = {
                fromAccount: '1234567890',
                toAccount: '0987654321',
                amount: 300,
                description: 'Peer transfer',
            };
            await transaction_controller_1.default.transfer(req, res, next);
            expect(transaction_service_1.default.transfer).toHaveBeenCalledWith('1234567890', '0987654321', 300, 'Peer transfer');
            expect(apiResponse_1.default).toHaveBeenCalledWith(201, 'Transfer successful', mockData);
            expect(sendMock).toHaveBeenCalledWith(res);
        });
    });
    describe('getHistory', () => {
        it('should handle retrieving transaction history', async () => {
            const mockData = [{ id: 'txn_1' }, { id: 'txn_2' }];
            transaction_service_1.default.getAccountHistory.mockResolvedValue(mockData);
            req.params = { accountNumber: '1234567890' };
            req.query = { page: '1', limit: '2' };
            await transaction_controller_1.default.getHistory(req, res, next);
            expect(transaction_service_1.default.getAccountHistory).toHaveBeenCalledWith('1234567890', 1, 2);
            expect(apiResponse_1.default).toHaveBeenCalledWith(200, 'Transaction history retrieved', mockData);
            expect(sendMock).toHaveBeenCalledWith(res);
        });
    });
});
