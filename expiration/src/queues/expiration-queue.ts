import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

// Define the structure of the payload that the queue will handle
interface Payload {
  orderId: string;
}

// Create a new Bull queue named 'order:expiration' with a specific type for the payload
// The queue will connect to a Redis server, with the host specified in the environment variables
const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST // Redis server host from environment variables
  }
});

// Define a processing function for the queue
expirationQueue.process(async (job) => {
  // publishing an event saying order is expired
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  });
});

export { expirationQueue };
