// src/app/modules/user/user.controller.ts
import { Request, Response } from 'express';
import { 
  createUserService, 
  loginUserService, 
  refreshAccessTokenService,
  logoutUserService, 
  updateUserProfileService,
  getUserProfileService,
  updateUserStatusService,
  getAllUsersService,
  updateUserPasswordService
} from './user.service';
import { 
  userRegistrationSchema, 
  userLoginSchema,
  refreshTokenSchema 
} from './user.validation';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const validatedData = userRegistrationSchema.parse(req.body);
    const user = await createUserService(validatedData);
    
    res.status(201).json({
      message: 'User registered successfully',
      success: true,
      data: { 
        email: user.email, 
        role: user.role ,
        name: user.name
      },
    });
  } catch (error: any) {
    res.status(400).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const validatedData = userLoginSchema.parse(req.body);
    const result = await loginUserService(validatedData);
    
    res.status(200).json({
      message: 'Login successful',
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const validatedData = refreshTokenSchema.parse(req.body);
    const result = await refreshAccessTokenService(validatedData.refreshToken);
    
    res.status(200).json({
      message: 'Token refreshed successfully',
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    await logoutUserService(refreshToken);
    
    res.status(200).json({
      message: 'Logout successful',
      success: true
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};

// src/app/modules/user/user.controller.ts

// Add these functions to your existing user.controller.ts

export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const email = req.user?.email;

    const result = await updateUserPasswordService(
      email as string,
      currentPassword,
      newPassword
    );
    
    res.status(200).json({
      message: result.message,
      success: true
    });
  } catch (error: any) {
    res.status(400).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    
    res.status(200).json({
      message: 'Users retrieved successfully',
      success: true,
      data: users
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    
    const user = await updateUserStatusService(userId, status);
    
    res.status(200).json({
      message: 'User status updated successfully',
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(400).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const email = req.user?.email;
    const user = await getUserProfileService(email as string);
    
    res.status(200).json({
      message: 'User profile retrieved successfully',
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(404).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const email = req.user?.email;
    const updateData = req.body;
    
    const user = await updateUserProfileService(email as string, updateData);
    
    res.status(200).json({
      message: 'User profile updated successfully',
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(400).json({ 
      message: error.message, 
      success: false 
    });
  }
};