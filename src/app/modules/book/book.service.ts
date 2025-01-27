// src/app/modules/book/book.service.ts
import { Book } from './book.model';
import { TBook } from './book.interface';

export const createBookService = async (bookData: TBook) => {
  return await Book.create(bookData);
};

export const getAllBooksService = async (searchTerm?: string) => {
  const query = searchTerm 
    ? { 
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { author: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } }
        ] 
      }
    : {};

  return await Book.find(query);
};

export const getBookByIdService = async (bookId: string) => {
  const book = await Book.findById(bookId);
  if (!book) throw new Error('Book not found');
  return book;
};

export const updateBookService = async (
  bookId: string, 
  updateData: Partial<TBook>
) => {
  const book = await Book.findByIdAndUpdate(
    bookId, 
    { $set: updateData }, 
    { new: true, runValidators: true }
  );
  
  if (!book) throw new Error('Book not found');
  return book;
};

export const deleteBookService = async (bookId: string) => {
  const book = await Book.findByIdAndDelete(bookId);
  if (!book) throw new Error('Book not found');
  return book;
};