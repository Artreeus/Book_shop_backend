// src/app/modules/book/book.routes.ts
import express from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
} from './book.controller';
import { 
  authenticateUser, 
  authorizeRoles 
} from '../../middlewares/auth.middleware';

const router = express.Router();

router.post(
  '/', 
  authenticateUser, 
  authorizeRoles(['admin']), 
  createBook
);

router.get('/', getAllBooks);

router.get('/:bookId', getBookById);

router.patch(
  '/:bookId', 
  authenticateUser, 
  authorizeRoles(['admin']), 
  updateBook
);

router.delete(
  '/:bookId', 
  authenticateUser, 
  authorizeRoles(['admin']), 
  deleteBook
);

export const BookRoutes = router;