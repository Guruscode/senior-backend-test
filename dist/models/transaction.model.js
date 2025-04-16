"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TransactionSchema = new mongoose_1.Schema({
    reference: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['CREDIT', 'DEPOSIT', 'WITHDRAWAL', 'DEBIT', 'TRANSFER'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    senderAccount: { type: String },
    receiverAccount: { type: String },
    description: { type: String }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Transaction', TransactionSchema);
