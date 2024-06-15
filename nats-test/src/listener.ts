import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

// console.clear();

// Connect to the NATS streaming server with a random client ID
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // Event listener for when the NATS connection is closed
  stan.on('close', () => {
    console.log('Nats Connection closed!');
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('order-service');
  const subscription = stan.subscribe(
    'ticket:created', // Subject to subscribe to
    'orders-service-queue-group', // Queue group name
    options // Subscription options
  );
  subscription.on('message', (msg: Message) => {
    const data = msg.getData();
    if (typeof data === 'string') {
      console.log(`Recieved event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack(); // Manually acknowledge the message to the NATS server
  });
});

// Event listener to handle SIGINT (Ctrl+C)
process.on('SIGINT', () => stan.close());

// Event listener to handle SIGTERM (termination request)
process.on('SIGTERM', () => stan.close());
