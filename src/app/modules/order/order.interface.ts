// order.interface.ts
import { Types } from 'mongoose';

export type TOrder = {
  user: Types.ObjectId;
  books: {
    book: Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
};