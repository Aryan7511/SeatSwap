import { Subjects, Publisher, OrderCancelledEvent } from '@sswaptickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
