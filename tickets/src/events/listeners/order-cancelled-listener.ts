import { Listener, OrderCancelledEvent, Subjects } from '@sswaptickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is associated with
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket found, throw an error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Unreserve the ticket by clearing the orderId
    ticket.set({ orderId: undefined });

    // Save the updated ticket
    await ticket.save();

    // Publish an event indicating that the ticket has been updated
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version
    });

    // Acknowledge the message
    msg.ack();
  }
}
