import express, { NextFunction, Request, Response } from 'express';
import { requireAuth } from '@sswaptickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find({
        userId: req.currentUser!.id
      }).populate('ticket');

      res.send(orders);
    } catch (error) {
      next(error);
    }
  }
);

export { router as indexOrderRouter };
