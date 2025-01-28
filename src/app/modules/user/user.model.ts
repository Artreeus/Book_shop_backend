// src/app/modules/user/user.model.ts
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { TUser, TUserToken, UserModel } from './user.interface';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'Blocked'],
      default: 'user',
    }
  },
  { timestamps: true }
);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(
    this.password, 
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string, 
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

const userTokenSchema = new Schema<TUserToken>(
  {
    email: {
      type: String,
      required: true,
      ref: 'User'
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 30 * 86400 // 30 days expiration
    },
    expiresAt: {
      type: Date,
      required: true
    }
  }
);

export const User = model<TUser, UserModel>('User', userSchema);
export const UserToken = model<TUserToken>('UserToken', userTokenSchema);