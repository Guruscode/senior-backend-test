"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const apiError_1 = __importDefault(require("../utils/apiError"));
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((detail) => ({
                message: detail.message,
                path: detail.path,
            }));
            return next(new apiError_1.default(400, 'Validation error', errors));
        }
        next();
    };
};
exports.validateBody = validateBody;
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query, { abortEarly: false });
        if (error) {
            const errors = error.details.map((detail) => ({
                message: detail.message,
                path: detail.path,
            }));
            return next(new apiError_1.default(400, 'Validation error', errors));
        }
        next();
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params, { abortEarly: false });
        if (error) {
            const errors = error.details.map((detail) => ({
                message: detail.message,
                path: detail.path,
            }));
            return next(new apiError_1.default(400, 'Validation error', errors));
        }
        next();
    };
};
exports.validateParams = validateParams;
