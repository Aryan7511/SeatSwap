import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  title: string;
  price: number;
}

// Define the structure of a Ticket document
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>; // Method to check if the ticket is reserved
}

// Define the structure of the Ticket model (includes static methods)
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    toJSON: {
      // Modify the JSON representation to use 'id' instead of '_id'
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

// Define a static method 'build' on the Ticket schema
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

// Define an instance method 'isReserved' on the Ticket schema
ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on i.e ('this' refers to the ticket document instance)

  /*  Run query to look at all orders.  Find an order where the ticket
     is the ticket we just found *and* the orders status is *not* cancelled.
     If we find an order from that means the ticket *is* reserved */
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [  
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  // Return true if there is an existing order, otherwise false (a way to convert it into boolean)
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
