"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const ms_1 = __importDefault(require("ms"));
const signToken = (id) => {
    if (typeof env_1.default.JWT_SECRET !== 'string') {
        throw new Error('JWT_SECRET must be a string.');
    }
    const expiresIn = env_1.default.JWT_EXPIRES_IN;
    if (expiresIn && typeof expiresIn !== 'string' && typeof expiresIn !== 'number') {
        throw new Error('JWT_EXPIRES_IN must be a string or number.');
    }
    const options = {};
    if (expiresIn) {
        if (typeof expiresIn === 'string') {
            const msExpiresIn = (0, ms_1.default)(expiresIn);
            if (isNaN(msExpiresIn)) {
                throw new Error(`Invalid duration format for JWT_EXPIRES_IN: ${expiresIn}`);
            }
            options.expiresIn = msExpiresIn / 1000;
        }
        else {
            options.expiresIn = expiresIn;
        }
    }
    return jsonwebtoken_1.default.sign({ id }, env_1.default.JWT_SECRET, options);
};
exports.signToken = signToken;
const verifyToken = (token) => {
    if (typeof env_1.default.JWT_SECRET !== 'string') {
        throw new Error('JWT_SECRET must be a string.');
    }
    return jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET);
};
exports.verifyToken = verifyToken;
