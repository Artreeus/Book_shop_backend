

// src/app/modules/user/user.routes.ts

import express from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  updateUserPassword,
  getAllUsers,
  updateUserStatus,
  getUserProfile,
  updateUserProfile
} from './user.controller';
import { 
  authenticateUser, 
  authorizeRoles 
} from '../../middlewares/auth.middleware';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticateUser, logoutUser);

// Profile routes
router.get(
  '/profile', 
  authenticateUser, 
  getUserProfile
);
router.patch(
  '/profile', 
  authenticateUser, 
  updateUserProfile
);
router.patch(
  '/update-password', 
  authenticateUser, 
  updateUserPassword
);

// Admin routes
router.get(
  '/all', 
  authenticateUser, 
  authorizeRoles(['admin']), 
  getAllUsers
);
router.patch(
  '/:userId/status', 
  authenticateUser, 
  authorizeRoles(['admin']), 
  updateUserStatus
);

export const UserRoutes = router;