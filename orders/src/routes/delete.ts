import express, { Request, Response, NextFunction } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
  OrderStatus
} from '@sswaptickets/common';
import { Order } from '../models/order';
import mongoose from 'mongoose';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;

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
      order.status = OrderStatus.Cancelled;
      await order.save();

      // publishing an event saying this was cancelled
      new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id
        }
      });

      res.status(204).send(order);
      /*If this was really a delete handler, we should technically also send back specifically a status of 204, 
      which indicates that a record was deleted.
      Again, we're not really deleting a record per se, we're cancelling it, but we're kind of pretending
      as though that's kind of a delete.*/
    } catch (error) {
      next(error);
    }
  }
);

export { router as deleteOrderRouter };
