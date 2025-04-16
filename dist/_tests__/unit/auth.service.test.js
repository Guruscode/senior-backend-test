"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../../services/auth.service"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const apiError_1 = __importDefault(require("../../utils/apiError"));
const axios_1 = require("axios");
const jwt_1 = require("../../utils/jwt");
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
            user_model_1.default.findOne.mockResolvedValue(null);
            user_model_1.default.create.mockResolvedValue(mockUser);
            const userInput = {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123',
                passwordConfirm: 'password123',
            };
            const result = await auth_service_1.default.register(userInput);
            expect(user_model_1.default.create).toHaveBeenCalledWith({
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
            await expect(auth_service_1.default.register(userInput)).rejects.toThrowError(new apiError_1.default(axios_1.HttpStatusCode.BadRequest, 'Passwords do not match'));
        });
        it('should throw error if email is already in use', async () => {
            const existingUser = { email: 'johndoe@example.com' };
            user_model_1.default.findOne.mockResolvedValue(existingUser);
            const userInput = {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123',
                passwordConfirm: 'password123',
            };
            await expect(auth_service_1.default.register(userInput)).rejects.toThrowError(new apiError_1.default(axios_1.HttpStatusCode.Conflict, 'Email already in use'));
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
            user_model_1.default.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            jwt_1.signToken.mockReturnValue('mockToken');
            const loginInput = {
                email: 'johndoe@example.com',
                password: 'password123',
            };
            const result = await auth_service_1.default.login(loginInput);
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
            user_model_1.default.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });
            const loginInput = {
                email: 'johndoe@example.com',
                password: 'password123',
            };
            await expect(auth_service_1.default.login(loginInput)).rejects.toThrowError(new apiError_1.default(axios_1.HttpStatusCode.Unauthorized, 'Invalid credentials'));
        });
        it('should throw error if password is incorrect', async () => {
            const mockUser = {
                id: '123',
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123',
                comparePassword: jest.fn().mockResolvedValue(false),
            };
            user_model_1.default.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            const loginInput = {
                email: 'johndoe@example.com',
                password: 'incorrectPassword',
            };
            await expect(auth_service_1.default.login(loginInput)).rejects.toThrowError(new apiError_1.default(axios_1.HttpStatusCode.Unauthorized, 'Invalid credentials'));
        });
    });
    describe('getMe', () => {
        it('should successfully return the logged-in user', async () => {
            const mockUser = { id: '123', name: 'John Doe', email: 'johndoe@example.com' };
            user_model_1.default.findById.mockResolvedValue(mockUser);
            const result = await auth_service_1.default.getMe('123');
            expect(user_model_1.default.findById).toHaveBeenCalledWith('123');
            expect(result).toEqual(mockUser);
        });
        it('should throw error if user not found', async () => {
            user_model_1.default.findById.mockResolvedValue(null);
            await expect(auth_service_1.default.getMe('123')).rejects.toThrowError(new apiError_1.default(axios_1.HttpStatusCode.NotFound, 'User not found'));
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
            user_model_1.default.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            await auth_service_1.default.changePassword(input);
            expect(mockUser.comparePassword).toHaveBeenCalledWith(input.currentPassword);
            expect(mockUser.password).toBe(input.newPassword);
            expect(mockUser.save).toHaveBeenCalled();
        });
    });
});
