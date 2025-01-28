// src/app/modules/user/user.interface.ts
import { Model } from 'mongoose';

export type TUserRole = 'admin' | 'user' | 'Blocked';

export type TUser = {
  name: string;  // Add the name field
  email: string;
  password: string;
  role: TUserRole;
  createdAt?: Date;
  updatedAt?: Date;
};


export type TUserToken = {
  email: string;
  token: string;
  createdAt?: Date;
  expiresAt: Date;
};

export interface UserModel extends Model<TUser> {
  isPasswordMatched(
    plainTextPassword: string, 
    hashedPassword: string
  ): Promise<boolean>;
}