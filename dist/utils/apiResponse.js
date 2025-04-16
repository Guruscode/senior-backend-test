"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiResponse {
    constructor(statusCode, message, data, success = true) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = success;
    }
    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data
        });
    }
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }
    static error(res, message, statusCode = 400, data) {
        return res.status(statusCode).json({
            success: false,
            message,
            data
        });
    }
}
exports.default = ApiResponse;
