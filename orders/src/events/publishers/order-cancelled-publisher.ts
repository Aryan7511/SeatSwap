import { Subjects, Publisher, OrderCancelledEvent } from '@sswaptickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
