// src/app/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';

import config from '../../config';
import { TUserRole } from '../modules/user/user.interface';
import  jwt  from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { 
        email: string; 
        role: TUserRole 
      };
    }
  }
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        message: 'No token provided',
        success: false,
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      config.jwt_secret as string
    ) as { email: string; role: TUserRole };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Invalid or expired token',
      success: false,
    });
  }
};



export const authorizeRoles = (allowedRoles: TUserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        message: 'Authentication required',
        success: false,
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: 'Access denied',
        success: false,
      });
      return;
    }

    next(); // Move to the next middleware
  };
};
