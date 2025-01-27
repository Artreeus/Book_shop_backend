// src/app/modules/order/order.routes.ts
import express from 'express';
import {
  createOrder,
  getUserOrders,
  getRevenue
} from './order.controller';
import { 
  authenticateUser, 
  authorizeRoles 
} from '../../middlewares/auth.middleware';

const router = express.Router();

router.post(
  '/', 
  authenticateUser, 
  createOrder
);

router.get(
  '/my-orders', 
  authenticateUser, 
  getUserOrders
);

router.get(
  '/revenue', 
  authenticateUser, 
  authorizeRoles(['admin']), 
  getRevenue
);

export const OrderRoutes = router;