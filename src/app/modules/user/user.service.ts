// src/app/modules/user/user.service.ts
import jwt from 'jsonwebtoken';
import { User, UserToken } from './user.model';
import config from '../../../config';
import { TUser, TUserRole } from './user.interface';

export const generateAccessToken = (user: { 
  email: string, 
  role: TUserRole 
}) => {
  return jwt.sign(
    { 
      email: user.email, 
      role: user.role 
    }, 
    config.jwt_secret as string, 
    { expiresIn: config.access_token_expires_in }
  );
};

export const generateRefreshToken = (user: { 
  email: string, 
  role: TUserRole 
}) => {
  return jwt.sign(
    { 
      email: user.email, 
      role: user.role 
    }, 
    config.refresh_token_secret as string, 
    { expiresIn: config.refresh_token_expires_in }
  );
};

export const createUserService = async (userData: Partial<TUser>) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  return await User.create(userData);
};

export const storeRefreshToken = async (
  email: string, 
  refreshToken: string
) => {
  const expiresAt = new Date(
    Date.now() + 
    parseInt(config.refresh_token_expires_in.replace(/\D/g, '')) * 
    (config.refresh_token_expires_in.includes('d') ? 86400000 : 1000)
  );

  await UserToken.create({
    email,
    token: refreshToken,
    expiresAt
  });
};

export const loginUserService = async (credentials: { 
  email: string, 
  password: string 
}) => {
  const { email, password } = credentials;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordMatch = await User.isPasswordMatched(
    password, 
    user.password
  );
  if (!isPasswordMatch) {
    throw new Error('Invalid credentials');
  }

  const accessToken = generateAccessToken({
    email: user.email,
    role: user.role
  });
  
  const refreshToken = generateRefreshToken({
    email: user.email,
    role: user.role
  });

  await storeRefreshToken(user.email, refreshToken);

  return { 
    accessToken, 
    refreshToken, 
    user: { 
      email: user.email, 
      role: user.role 
    }
  };
};

export const refreshAccessTokenService = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken, 
      config.refresh_token_secret as string
    ) as { email: string; role: TUserRole };

    const storedToken = await UserToken.findOne({ token: refreshToken });
    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = generateAccessToken({
      email: decoded.email,
      role: decoded.role
    });

    return { 
      accessToken: newAccessToken, 
      email: decoded.email 
    };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const logoutUserService = async (refreshToken: string) => {
  await UserToken.deleteOne({ token: refreshToken });
};