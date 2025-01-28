// src/config/index.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });



export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  
  // Authentication Config
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || '10',
  jwt_secret: process.env.JWT_SECRET || 'your-secret-key',
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret',
  
  // Token Expiration
  access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN || "365d",
  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN || "365d",
  
};