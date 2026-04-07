import { Router } from 'express';
import {
  registerValidator,
  loginValidator,
} from '../validator/auth.validator.js';
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controller/auth.controller.js';

const router = Router();

router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);
router.post('/logout', logoutUser);

export default router;
