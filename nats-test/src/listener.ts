import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

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

  new TicketCreatedListener(stan).listen();
});

// Event listener to handle SIGINT (Ctrl+C)
process.on('SIGINT', () => stan.close());

// Event listener to handle SIGTERM (termination request)
process.on('SIGTERM', () => stan.close());

