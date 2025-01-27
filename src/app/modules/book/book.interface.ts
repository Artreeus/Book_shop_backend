// src/app/modules/book/book.interface.ts
import { Model } from 'mongoose';

export type TBookCategory = 'Fiction' | 'Science' | 'SelfDevelopment' | 'Poetry' | 'Religious';

export type TBook = {
  title: string;
  author: string;
  price: number;
  category: TBookCategory;
  description: string;
  quantity: number;
  inStock: boolean;
  image?: string;
};

export interface BookModel extends Model<TBook> {}