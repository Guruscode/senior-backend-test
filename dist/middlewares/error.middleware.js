"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiError_1 = __importDefault(require("../utils/apiError"));
const logger_1 = __importDefault(require("../config/logger"));
const axios_1 = require("axios");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof apiError_1.default) {
        logger_1.default.error(err.message);
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
        return;
    }
    logger_1.default.error(err.stack || err.message);
    res.status(axios_1.HttpStatusCode.InternalServerError).json({
        success: false,
        message: 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.default = errorMiddleware;
