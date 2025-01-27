// src/app/modules/book/book.model.ts
import { Schema, model } from 'mongoose';
import { TBook, BookModel } from './book.interface';

const bookSchema = new Schema<TBook>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Fiction', 'Science', 'SelfDevelopment', 'Poetry', 'Religious'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity must be a non-negative number'],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
  },
}, { timestamps: true });

export const Book = model<TBook, BookModel>('Book', bookSchema);