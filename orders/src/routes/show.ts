import express, { Request, Response, NextFunction } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError
} from '@sswaptickets/common';
import { Order } from '../models/order';
import mongoose from 'mongoose';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.orderId;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new BadRequestError('Invalid order ID');
      }

      const order = await Order.findById(orderId).populate('ticket');

      if (!order) {
        throw new NotFoundError();
      }
      if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }

      res.send(order);  
    } catch (error) {
      next(error);
    }
  }
);

export { router as showOrderRouter };
