import { Publisher, Subjects, TicketCreatedEvent } from '@sswaptickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}