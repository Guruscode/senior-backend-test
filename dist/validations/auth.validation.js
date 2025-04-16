"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.changePasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
// auth.validation.ts
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
    passwordConfirm: joi_1.default.string().valid(joi_1.default.ref('password')).required()
        .messages({ 'any.only': 'Passwords do not match' })
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
exports.changePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().min(8).required(),
    newPasswordConfirm: joi_1.default.string().valid(joi_1.default.ref('newPassword')).required()
        .messages({ 'any.only': 'Passwords do not match' })
});
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
exports.resetPasswordSchema = joi_1.default.object({
    password: joi_1.default.string().min(8).required(),
    passwordConfirm: joi_1.default.string().valid(joi_1.default.ref('password')).required()
        .messages({ 'any.only': 'Passwords do not match' })
});
