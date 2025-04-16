"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
class ApiError extends Error {
    constructor(statusCode, message, errors = [], stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.stack = stack;
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    static badRequest(message, errors = []) {
        return new ApiError(axios_1.HttpStatusCode.BadRequest, message, errors);
    }
    static unauthorized(message) {
        return new ApiError(axios_1.HttpStatusCode.Unauthorized, message);
    }
    static forbidden(message) {
        return new ApiError(axios_1.HttpStatusCode.Forbidden, message);
    }
    static notFound(message) {
        return new ApiError(axios_1.HttpStatusCode.NotFound, message);
    }
    static internal(message) {
        return new ApiError(axios_1.HttpStatusCode.InternalServerError, message);
    }
}
exports.default = ApiError;
