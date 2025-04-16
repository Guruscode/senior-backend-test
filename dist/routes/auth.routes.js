"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_validation_1 = require("../validations/auth.validation");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', (0, validation_middleware_1.validateBody)(auth_validation_1.registerSchema), auth_controller_1.default.register);
router.post('/login', (0, validation_middleware_1.validateBody)(auth_validation_1.loginSchema), auth_controller_1.default.login);
router.post('/forgot-password', (0, validation_middleware_1.validateBody)(auth_validation_1.forgotPasswordSchema), auth_controller_1.default.forgotPassword);
router.post('/reset-password/:token', (0, validation_middleware_1.validateBody)(auth_validation_1.resetPasswordSchema), auth_controller_1.default.resetPassword);
// Protected routes (require authentication)
router.use(auth_middleware_1.authenticate); // Use authenticate middleware
router.get('/user-me', auth_controller_1.default.getMe);
router.patch('/change-password', (0, validation_middleware_1.validateBody)(auth_validation_1.changePasswordSchema), auth_controller_1.default.changePassword);
exports.default = router;
