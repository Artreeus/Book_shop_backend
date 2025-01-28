
// order.service.ts
import mongoose from 'mongoose';
import { Order } from './order.model';
import { Book } from '../book/book.model';
import { User } from '../user/user.model';
import { TOrder } from './order.interface';

export const createOrderService = async (orderData: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get user by email
    const user = await User.findOne({ email: orderData.user });
    if (!user) {
      throw new Error('User not found');
    }

    // Replace email with user's ObjectId
    const orderDataWithUserId = {
      ...orderData,
      user: user._id
    };

    // Calculate total price and check inventory
    let totalPrice = 0;
    const bookUpdates: any[] = [];

    for (const item of orderDataWithUserId.books) {
      const book = await Book.findById(item.book);
      if (!book) {
        throw new Error(`Book ${item.book} not found`);
      }
      
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

    const orderDataWithTotal = {
      ...orderDataWithUserId,
      totalPrice
    };

    const order = await Order.create([orderDataWithTotal], { session });
    await Book.bulkWrite(bookUpdates, { session });

    await session.commitTransaction();
    
    const populatedOrder = await Order.findById(order[0]._id)
      .populate('books.book', 'title price')
      .populate('user', 'email name');
      
    return populatedOrder;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getOrdersService = async (userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new Error('User not found');
  }

  return await Order.find({ user: user._id })
    .populate('books.book', 'title price')
    .populate('user', 'email name')
    .sort({ createdAt: -1 });
};

export const calculateRevenueService = async () => {
  const revenue = await Order.aggregate([
    {
      $match: {
        status: 'completed'
      }
    },
    { 
      $group: { 
        _id: null, 
        totalRevenue: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 }
      } 
    }
  ]);

  return {
    totalRevenue: revenue[0]?.totalRevenue || 0,
    totalOrders: revenue[0]?.totalOrders || 0
  };
};


export const getAllOrdersService = async (query: any = {}) => {
  const {
    status,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10
  } = query;

  // Build filter object
  const filter: any = {};
  
  if (status) {
    filter.status = status;
  }
  
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  // Calculate skip value for pagination
  const skip = (Number(page) - 1) * Number(limit);

  // Build sort object
  const sort: any = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const orders = await Order.find(filter)
    .populate('books.book', 'title price')
    .populate('user', 'email name')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Order.countDocuments(filter);

  return {
    orders,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalOrders: total
    }
  };
};


export const updateOrderStatusService = async (
  orderId: string, 
  status: 'processing' | 'completed' | 'pending' | 'cancelled', 
  userEmail: string
) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new Error('User not found');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  // Only admin can update to processing/completed
  if (['processing', 'completed'].includes(status)) {
    const isAdmin = user.role === 'admin';
    if (!isAdmin) {
      throw new Error('Not authorized to update order status');
    }
  }

  // Only order owner can cancel their order
  if (status === 'cancelled') {
    const isOwner = order.user.toString() === user._id.toString();
    if (!isOwner && user.role !== 'admin') {
      throw new Error('Not authorized to cancel this order');
    }

    // If order is being cancelled, restore book quantities
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const bookUpdates = order.books.map(item => ({
        updateOne: {
          filter: { _id: item.book },
          update: { 
            $inc: { quantity: item.quantity },
            $set: { inStock: true }
          }
        }
      }));

      await Book.bulkWrite(bookUpdates, { session });
      order.status = status;
      await order.save({ session });
      
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } else {
    order.status = status;
    await order.save();
  }

  return await Order.findById(orderId)
    .populate('books.book', 'title price')
    .populate('user', 'email name');
};

export const deleteOrderService = async (orderId: string, userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new Error('User not found');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  // Only allow deletion if order is cancelled and user is the owner
  if (order.status !== 'cancelled') {
    throw new Error('Only cancelled orders can be deleted');
  }

  const isOwner = order.user.toString() === user._id.toString();
  if (!isOwner && user.role !== 'admin') {
    throw new Error('Not authorized to delete this order');
  }

  await Order.findByIdAndDelete(orderId);
};
