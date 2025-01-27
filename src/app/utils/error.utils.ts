// src/app/utils/error.util.ts
import { ZodError } from 'zod';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string, 
    statusCode: number, 
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleZodError = (error: ZodError) => {
  const errorMessages = error.errors.map(issue  => ({
    path: issue.path[issue.path.length - 1],
    message: issue.message
  }));

  return {
    success: false,
    message: 'Validation Error',
    errorMessages
  };
};