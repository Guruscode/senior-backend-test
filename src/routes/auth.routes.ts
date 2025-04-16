import { Router, RequestHandler } from 'express';


import AuthController from '../controllers/auth.controller';
import { 
  registerSchema, 
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validations/auth.validation';
import { validateBody } from '../middlewares/validation.middleware'; 

import { authenticate } from '../middlewares/auth.middleware'; 

const router = Router();

// Public routes
router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/forgot-password', validateBody(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password/:token', validateBody(resetPasswordSchema), AuthController.resetPassword);

// Protected routes (require authentication)
router.use(authenticate); // Use authenticate middleware

router.get('/user-me', AuthController.getMe as RequestHandler);
router.patch('/change-password', validateBody(changePasswordSchema), AuthController.changePassword as RequestHandler);

export default router;
