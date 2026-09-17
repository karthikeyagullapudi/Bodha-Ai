import { Router } from 'express';
import {
  registerValidator,
  loginValidator,
  resendVerificationValidator,
} from '../validator/auth.validator.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resendVerification,
  getMe,
} from '../controller/auth.controller.js';
import { identifyUser } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const authRouter = Router();

authRouter.post('/register', authLimiter, registerValidator, registerUser);
authRouter.post('/login', authLimiter, loginValidator, loginUser);
// No identifyUser here: an expired session must still be able to clear its cookie
authRouter.post('/logout', logoutUser);
authRouter.get('/verify-email', verifyEmail);
authRouter.post(
  '/resend-verification',
  authLimiter,
  resendVerificationValidator,
  resendVerification,
);
authRouter.get('/get-me', identifyUser, getMe);

export default authRouter;
