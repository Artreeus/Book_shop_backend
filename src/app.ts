// src/app.ts
import cors from 'cors';
import express, { Application } from 'express';
import { UserRoutes } from './app/modules/user/user.routes';
import { BookRoutes } from './app/modules/book/book.routes';
import { OrderRoutes } from './app/modules/order/order.routes';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', UserRoutes);
app.use('/api/books', BookRoutes);
app.use('/api/orders', OrderRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Book Store Server is running', 
    success: true 
  });
});

// Global error handler (to be implemented)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong',
    errorDetails: err.errors || null
  });
});

export default app;