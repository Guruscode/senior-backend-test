"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModel = void 0;
const mongoose_1 = require("mongoose");
const account_interface_1 = require("../interfaces/account.interface");
const AccountSchema = new mongoose_1.Schema({
    accountNumber: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, enum: Object.values(account_interface_1.Currency), required: true }
}, { timestamps: true });
exports.AccountModel = (0, mongoose_1.model)('Account', AccountSchema);
