import { HttpStatusCode } from 'axios';

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors: any[] = [],
    public stack: string = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message: string, errors: any[] = []) {
    return new ApiError(HttpStatusCode.BadRequest, message, errors);
  }

  static unauthorized(message: string) {
    return new ApiError(HttpStatusCode.Unauthorized, message);
  }

  static forbidden(message: string) {
    return new ApiError(HttpStatusCode.Forbidden, message);
  }

  static notFound(message: string) {
    return new ApiError(HttpStatusCode.NotFound, message);
  }

  static internal(message: string) {
    return new ApiError(HttpStatusCode.InternalServerError, message);
  }
}

export default ApiError;