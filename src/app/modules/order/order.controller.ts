import { Request, Response } from 'express';
import { 
  createOrderService, 
  getOrdersService,
  calculateRevenueService, 
  getAllOrdersService,
  deleteOrderService,
  updateOrderStatusService
} from './order.service';
import { z } from 'zod';

const orderSchema = z.object({
  books: z.array(z.object({
    book: z.string(),
    quantity: z.number().int().min(1)
  })),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']).optional()
});

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.email) {
      res.status(401).json({
        message: 'User not authenticated',
        success: false
      });
      return;
    }

    const validatedData = orderSchema.parse({
      books: req.body.books,
      status: req.body.status
    });

    const order = await createOrderService({
      ...validatedData,
      user: req.user.email,
    });

    res.status(201).json({
      message: 'Order created successfully',
      success: true,
      data: order
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 
                      error.name === 'ZodError' ? 400 : 500;
    
    res.status(statusCode).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.email) {
      res.status(401).json({
        message: 'User not authenticated',
        success: false
      });
      return;
    }

    const orders = await getOrdersService(req.user.email);

    res.status(200).json({
      message: 'Orders retrieved successfully',
      success: true,
      data: orders
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const getRevenue = async (req: Request, res: Response): Promise<void> => {
  try {
    const revenueData = await calculateRevenueService();

    res.status(200).json({
      message: 'Revenue calculated successfully',
      success: true,
      data: revenueData
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};


export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getAllOrdersService(req.query);

    res.status(200).json({
      message: 'Orders retrieved successfully',
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};


export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!req.user?.email) {
      res.status(401).json({
        message: 'User not authenticated',
        success: false
      });
      return;
    }

    const updatedOrder = await updateOrderStatusService(orderId, status, req.user.email);

    res.status(200).json({
      message: 'Order status updated successfully',
      success: true,
      data: updatedOrder
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 
                      error.message.includes('not authorized') ? 403 : 500;
    
    res.status(statusCode).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;

    if (!req.user?.email) {
      res.status(401).json({
        message: 'User not authenticated',
        success: false
      });
      return;
    }

    await deleteOrderService(orderId, req.user.email);

    res.status(200).json({
      message: 'Order deleted successfully',
      success: true
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 
                      error.message.includes('not authorized') ? 403 : 500;
    
    res.status(statusCode).json({ 
      message: error.message, 
      success: false 
    });
  }
};