// src/utils/apiResponse.ts
import { Response } from 'express';

export default class ApiResponse {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any,
    public success: boolean = true
  ) {}

  send(res: Response) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data
    });
  }

  static success(res: Response, data: any, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res: Response, message: string, statusCode = 400, data?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      data
    });
  }
}