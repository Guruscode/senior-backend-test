"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const jwt_1 = require("../utils/jwt");
const axios_1 = require("axios");
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    async register(userInput) {
        if (userInput.password !== userInput.passwordConfirm) {
            throw new apiError_1.default(axios_1.HttpStatusCode.BadRequest, 'Passwords do not match');
        }
        if (await user_model_1.default.findOne({ email: userInput.email })) {
            throw new apiError_1.default(axios_1.HttpStatusCode.Conflict, 'Email already in use');
        }
        const user = await user_model_1.default.create({
            name: userInput.name,
            email: userInput.email,
            password: userInput.password
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    }
    async login(loginInput) {
        const user = await user_model_1.default.findOne({ email: loginInput.email }).select('+password');
        if (!user || !(await user.comparePassword(loginInput.password))) {
            throw new apiError_1.default(axios_1.HttpStatusCode.Unauthorized, 'Invalid credentials');
        }
        const token = (0, jwt_1.signToken)(user.id);
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        };
    }
    async getMe(userId) {
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            throw new apiError_1.default(axios_1.HttpStatusCode.NotFound, 'User not found');
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email
        };
    }
    async changePassword(input) {
        const user = await user_model_1.default.findById(input.userId).select('+password');
        if (!user) {
            throw new apiError_1.default(axios_1.HttpStatusCode.NotFound, 'User not found');
        }
        if (!(await user.comparePassword(input.currentPassword))) {
            throw new apiError_1.default(axios_1.HttpStatusCode.Unauthorized, 'Current password is incorrect');
        }
        user.password = input.newPassword;
        await user.save();
    }
    async forgotPassword(input) {
        const user = await user_model_1.default.findOne({ email: input.email });
        if (!user) {
            throw new apiError_1.default(axios_1.HttpStatusCode.NotFound, 'User not found');
        }
        // Generate reset token (but don't send email)
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        user.passwordResetToken = crypto_1.default
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();
        // Return the token so it can be handled by the client
        return { resetToken };
    }
    async resetPassword(input) {
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(input.token)
            .digest('hex');
        const user = await user_model_1.default.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });
        if (!user) {
            throw new apiError_1.default(axios_1.HttpStatusCode.BadRequest, 'Token is invalid or has expired');
        }
        user.password = input.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
    }
}
exports.default = new AuthService();
