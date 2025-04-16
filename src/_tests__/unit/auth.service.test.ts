import AuthService from '../../services/auth.service';
import User from '../../models/user.model';
import ApiError from '../../utils/apiError';
import { HttpStatusCode } from 'axios';
import crypto from 'crypto';
import { signToken } from '../../utils/jwt';


jest.mock('../../models/user.model');
jest.mock('crypto');
jest.mock('../../utils/jwt');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        id: '123',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn(),
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const userInput = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      const result = await AuthService.register(userInput);

      expect(User.create).toHaveBeenCalledWith({
        name: userInput.name,
        email: userInput.email,
        password: userInput.password,
      });

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
      });
    });

    it('should throw error if passwords do not match', async () => {
      const userInput = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        passwordConfirm: 'password456',
      };

      await expect(AuthService.register(userInput)).rejects.toThrowError(
        new ApiError(HttpStatusCode.BadRequest, 'Passwords do not match')
      );
    });

    it('should throw error if email is already in use', async () => {
      const existingUser = { email: 'johndoe@example.com' };
      (User.findOne as jest.Mock).mockResolvedValue(existingUser);

      const userInput = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      await expect(AuthService.register(userInput)).rejects.toThrowError(
        new ApiError(HttpStatusCode.Conflict, 'Email already in use')
      );
    });
  });

  describe('login', () => {
    it('should successfully login and return a token', async () => {
      const mockUser = {
        id: '123',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      // Mock the chained call: User.findOne().select()
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      (signToken as jest.Mock).mockReturnValue('mockToken');

      const loginInput = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      const result = await AuthService.login(loginInput);

      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginInput.password);
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
        token: 'mockToken',
      });
    });

    it('should throw error if user is not found', async () => {
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const loginInput = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      await expect(AuthService.login(loginInput)).rejects.toThrowError(
        new ApiError(HttpStatusCode.Unauthorized, 'Invalid credentials')
      );
    });

    it('should throw error if password is incorrect', async () => {
      const mockUser = {
        id: '123',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const loginInput = {
        email: 'johndoe@example.com',
        password: 'incorrectPassword',
      };

      await expect(AuthService.login(loginInput)).rejects.toThrowError(
        new ApiError(HttpStatusCode.Unauthorized, 'Invalid credentials')
      );
    });
  });

  describe('getMe', () => {
    it('should successfully return the logged-in user', async () => {
      const mockUser = { id: '123', name: 'John Doe', email: 'johndoe@example.com' };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.getMe('123');

      expect(User.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.getMe('123')).rejects.toThrowError(
        new ApiError(HttpStatusCode.NotFound, 'User not found')
      );
    });
  });

  describe('changePassword', () => {
    it('should successfully change the password', async () => {
      const mockUser = {
        id: '123',
        password: 'oldPassword',
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn(),
      };

      const input = {
        userId: '123',
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
        newPasswordConfirm: 'newPassword',
      };


      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await AuthService.changePassword(input);

      expect(mockUser.comparePassword).toHaveBeenCalledWith(input.currentPassword);
      expect(mockUser.password).toBe(input.newPassword);
      expect(mockUser.save).toHaveBeenCalled();
    });
  });
});
