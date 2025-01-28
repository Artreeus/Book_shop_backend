
// order.routes.ts
import express from 'express';

import { 
  authenticateUser, 
  authorizeRoles 
} from '../../middlewares/auth.middleware';
import { createOrder, deleteOrder, getAllOrders, getRevenue, getUserOrders, updateOrderStatus } from './order.controller';

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

router.get(
  '/all', 
  authenticateUser, 
  authorizeRoles(['admin']), 
  getAllOrders
);

router.patch(
  '/:orderId/status',
  authenticateUser,
  updateOrderStatus
);

router.delete(
  '/:orderId',
  authenticateUser,
  deleteOrder
);

export const OrderRoutes = router;