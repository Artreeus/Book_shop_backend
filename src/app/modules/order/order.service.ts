// src/app/modules/order/order.service.ts
import mongoose from 'mongoose';
import { Order } from './order.model';
import { Book } from '../book/book.model';
import { TOrder } from './order.interface';

export const createOrderService = async (orderData: TOrder) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Calculate total price and check inventory
    let totalPrice = 0;
    const bookUpdates: any[] = [];

    for (const item of orderData.books) {
      const book = await Book.findById(item.book);
      if (!book) throw new Error(`Book ${item.book} not found`);
      
      if (book.quantity < item.quantity) {
        throw new Error(`Insufficient stock for book ${book.title}`);
      }

      totalPrice += book.price * item.quantity;
      
      bookUpdates.push({
        updateOne: {
          filter: { _id: item.book },
          update: { 
            $inc: { quantity: -item.quantity },
            $set: { inStock: book.quantity > item.quantity }
          }
        }
      });
    }

    // Update order data with total price
    const orderDataWithTotal = {
      ...orderData,
      totalPrice
    };

    // Create order
    const order = await Order.create([orderDataWithTotal], { session });

    // Update book inventories
    await Book.bulkWrite(bookUpdates, { session });

    await session.commitTransaction();
    return order[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getOrdersService = async (userId: string) => {
  return await Order.find({ user: userId })
    .populate('books.book')
    .populate('user');
};

export const calculateRevenueService = async () => {
  const revenue = await Order.aggregate([
    { 
      $group: { 
        _id: null, 
        totalRevenue: { $sum: '$totalPrice' } 
      } 
    }
  ]);

  return revenue[0]?.totalRevenue || 0;
};