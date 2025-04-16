"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const axios_1 = require("axios");
class AuthController {
    constructor() {
        this.register = async (req, res, next) => {
            try {
                const userInput = req.body;
                const authResponse = await auth_service_1.default.register(userInput);
                res.status(201).json(authResponse);
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const loginInput = req.body;
                const authResponse = await auth_service_1.default.login(loginInput);
                res.status(200).json(authResponse);
            }
            catch (error) {
                next(error);
            }
        };
        this.getMe = async (req, res, next) => {
            try {
                if (!req.user) {
                    throw new apiError_1.default(axios_1.HttpStatusCode.Unauthorized, 'Not authenticated');
                }
                res.status(200).json(req.user);
            }
            catch (error) {
                next(error);
            }
        };
        this.changePassword = async (req, res, next) => {
            try {
                if (!req.user) {
                    throw new apiError_1.default(axios_1.HttpStatusCode.Unauthorized, 'Not authenticated');
                }
                const input = {
                    userId: req.user.id,
                    ...req.body
                };
                await auth_service_1.default.changePassword(input);
                res.status(200).json({ message: 'Password changed successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.forgotPassword = async (req, res, next) => {
            try {
                const input = req.body;
                const result = await auth_service_1.default.forgotPassword(input);
                res.status(200).json({
                    message: 'Password reset token generated',
                    resetToken: result.resetToken
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.resetPassword = async (req, res, next) => {
            try {
                const input = {
                    token: req.params.token,
                    ...req.body
                };
                await auth_service_1.default.resetPassword(input);
                res.status(200).json({ message: 'Password reset successful' });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = new AuthController();
