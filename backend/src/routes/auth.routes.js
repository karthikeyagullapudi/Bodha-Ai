import { Router } from 'express';
import {
  registerValidator,
  loginValidator,
} from '../validator/auth.validator.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
} from '../controller/auth.controller.js';
import { identifyUser } from '../middleware/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', registerValidator, registerUser);
authRouter.post('/login', loginValidator, loginUser);
authRouter.post('/logout', identifyUser, logoutUser);
authRouter.get('/verify-email', verifyEmail);

export default authRouter;
