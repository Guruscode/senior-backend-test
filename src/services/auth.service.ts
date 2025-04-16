import User from '../models/user.model';
import ApiError from '../utils/apiError';
import { 
  ILoginInput, 
  IRegisterInput, 
  IAuthResponse,
  IChangePasswordInput,
  IForgotPasswordInput,
  IResetPasswordInput
} from '../interfaces/auth.interface';
import { signToken } from '../utils/jwt';
import { HttpStatusCode } from 'axios';
import crypto from 'crypto';

class AuthService {
  async register(userInput: IRegisterInput): Promise<Omit<IAuthResponse, 'token'>> {
    if (userInput.password !== userInput.passwordConfirm) {
      throw new ApiError(HttpStatusCode.BadRequest, 'Passwords do not match');
    }

    if (await User.findOne({ email: userInput.email })) {
      throw new ApiError(HttpStatusCode.Conflict, 'Email already in use');
    }

    const user = await User.create({
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

  async login(loginInput: ILoginInput): Promise<IAuthResponse> {
    const user = await User.findOne({ email: loginInput.email }).select('+password');
    
    if (!user || !(await user.comparePassword(loginInput.password))) {
      throw new ApiError(HttpStatusCode.Unauthorized, 'Invalid credentials');
    }

    const token = signToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    };
  }

  async getMe(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(HttpStatusCode.NotFound, 'User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }

  async changePassword(input: IChangePasswordInput) {
    const user = await User.findById(input.userId).select('+password');
    if (!user) {
      throw new ApiError(HttpStatusCode.NotFound, 'User not found');
    }

    if (!(await user.comparePassword(input.currentPassword))) {
      throw new ApiError(HttpStatusCode.Unauthorized, 'Current password is incorrect');
    }

    user.password = input.newPassword;
    await user.save();
  }

  async forgotPassword(input: IForgotPasswordInput) {
    const user = await User.findOne({ email: input.email });
    if (!user) {
      throw new ApiError(HttpStatusCode.NotFound, 'User not found');
    }

    // Generate reset token (but don't send email)
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Return the token so it can be handled by the client
    return { resetToken };
  }

  async resetPassword(input: IResetPasswordInput) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(input.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new ApiError(HttpStatusCode.BadRequest, 'Token is invalid or has expired');
    }

    user.password = input.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  }
}

export default new AuthService();