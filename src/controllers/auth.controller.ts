import { RequestHandler, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';
import { 
  IRegisterInput, 
  ILoginInput,
  IChangePasswordInput,
  IForgotPasswordInput,
  IResetPasswordInput
} from '../interfaces/auth.interface';
import ApiError from '../utils/apiError';
import { HttpStatusCode } from 'axios';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

class AuthController {
  register: RequestHandler = async (req, res, next) => {
    try {
      const userInput: IRegisterInput = req.body;
      const authResponse = await AuthService.register(userInput);
      res.status(201).json(authResponse);
    } catch (error) {
      next(error);
    }
  };

  login: RequestHandler = async (req, res, next) => {
    try {
      const loginInput: ILoginInput = req.body;
      const authResponse = await AuthService.login(loginInput);
      res.status(200).json(authResponse);
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new ApiError(HttpStatusCode.Unauthorized, 'Not authenticated');
      }
      res.status(200).json(req.user);
    } catch (error) {
      next(error);
    }
  };

  
  changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new ApiError(HttpStatusCode.Unauthorized, 'Not authenticated');
      }
      const input: IChangePasswordInput = {
        userId: req.user.id,
        ...req.body
      };
      await AuthService.changePassword(input);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  };
  forgotPassword: RequestHandler = async (req, res, next) => {
    try {
      const input: IForgotPasswordInput = req.body;
      const result = await AuthService.forgotPassword(input);
      res.status(200).json({ 
        message: 'Password reset token generated',
        resetToken: result.resetToken
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword: RequestHandler = async (req, res, next) => {
    try {
      const input: IResetPasswordInput = {
        token: req.params.token,
        ...req.body
      };
      await AuthService.resetPassword(input);
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();