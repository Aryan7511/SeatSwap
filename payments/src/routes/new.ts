import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus
} from '@sswaptickets/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, orderId } = req.body;

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        throw new NotFoundError();
      }

      if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }
      if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Cannot pay for an cancelled order');
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.price * 100, // in cents
        currency: 'usd',
        payment_method_types: ['card'],
        payment_method: 'pm_card_visa', // replace with actual payment method id
        confirm: true,
        metadata: { orderId: order.id }
      });

      const payment = Payment.build({
        orderId,
        stripeId: paymentIntent.id
      });

      await payment.save();

      await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
      });

      res.status(201).json({ id: payment.id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as createChargeRouter };
