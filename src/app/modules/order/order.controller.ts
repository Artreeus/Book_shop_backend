// src/app/modules/order/order.controller.ts
import { Request, Response } from 'express';
import { 
  createOrderService, 
  getOrdersService,
  calculateRevenueService 
} from './order.service';
import { z } from 'zod';

const orderSchema = z.object({
  books: z.array(z.object({
    book: z.string(),
    quantity: z.number().int().min(1)
  })),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']).optional()
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const validatedData = orderSchema.parse({
      ...req.body,
      user: req.user?.email
    });

    const order = await createOrderService({
      ...validatedData,
      user: req.user?.email as any,
      totalPrice: 0 // Calculated in service
    });

    res.status(201).json({
      message: 'Order created successfully',
      success: true,
      data: order
    });
  } catch (error: any) {
    res.status(400).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await getOrdersService(req.user?.email as string);

    res.status(200).json({
      message: 'Orders retrieved successfully',
      success: true,
      data: orders
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};

export const getRevenue = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await calculateRevenueService();

    res.status(200).json({
      message: 'Revenue calculated successfully',
      success: true,
      data: { totalRevenue }
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};