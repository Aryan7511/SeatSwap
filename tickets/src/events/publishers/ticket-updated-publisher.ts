import { Publisher, Subjects, TicketUpdatedEvent } from '@sswaptickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}