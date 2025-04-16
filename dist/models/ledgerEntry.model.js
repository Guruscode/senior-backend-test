"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = void 0;
const mongoose_1 = require("mongoose");
const account_interface_1 = require("../interfaces/account.interface");
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "DEPOSIT";
    TransactionType["WITHDRAWAL"] = "WITHDRAWAL";
    TransactionType["TRANSFER"] = "TRANSFER";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
const LedgerEntrySchema = new mongoose_1.Schema({
    transactionReference: { type: String, required: true },
    accountId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: Object.values(account_interface_1.Currency), required: true },
    type: { type: String, enum: Object.values(TransactionType), required: true },
    reference: { type: String, required: true },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true }
}, { timestamps: true });
// Index for faster queries on account history
LedgerEntrySchema.index({ account: 1, createdAt: -1 });
exports.default = (0, mongoose_1.model)('LedgerEntry', LedgerEntrySchema);
