import { Subjects, Publisher, PaymentCreatedEvent } from '@sswaptickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
