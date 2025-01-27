// src/app/modules/book/book.controller.ts
import { Request, Response } from 'express';
import { 
  createBookService, 
  getAllBooksService, 
  getBookByIdService,
  updateBookService,
  deleteBookService 
} from './book.service';
import { createBookSchema, updateBookSchema } from './book.validation';

export const createBook = async (req: Request, res: Response) => {
  try {
    const validatedData = createBookSchema.parse(req.body);
    const book = await createBookService(validatedData);
    
    res.status(201).json({
      message: 'Book created successfully',
      success: true,
      data: book
    });
  } catch (error: any) {
    res.status(400).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;
    const books = await getAllBooksService(searchTerm as string);
    
    res.status(200).json({
      message: 'Books retrieved successfully',
      success: true,
      data: books
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const book = await getBookByIdService(bookId);
    
    res.status(200).json({
      message: 'Book retrieved successfully',
      success: true,
      data: book
    });
  } catch (error: any) {
    res.status(404).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const validatedData = updateBookSchema.parse(req.body);
    const book = await updateBookService(bookId, validatedData);
    
    res.status(200).json({
      message: 'Book updated successfully',
      success: true,
      data: book
    });
  } catch (error: any) {
    res.status(400).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    await deleteBookService(bookId);
    
    res.status(200).json({
      message: 'Book deleted successfully',
      success: true
    });
  } catch (error: any) {
    res.status(404).json({ 
      message: error.message, 
      success: false 
    });
  }
};