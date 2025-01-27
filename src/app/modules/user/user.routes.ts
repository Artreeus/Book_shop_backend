// src/app/modules/user/user.routes.ts
import express from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser
} from './user.controller';
import { authenticateUser } from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticateUser, logoutUser);

export const UserRoutes = router;