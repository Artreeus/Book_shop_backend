// src/app/modules/user/user.controller.ts
import { Request, Response } from 'express';
import { 
  createUserService, 
  loginUserService, 
  refreshAccessTokenService,
  logoutUserService 
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
        role: user.role 
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