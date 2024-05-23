import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@sswaptickets/common';
import { createTicketRouter } from './routes/new';

const app = express();
/*we are just adding in this little step right here to make sure that Express is aware
that it's behind a proxy of Ingress Engine X, and to make sure that it should still trust traffic as being secure, 
even though it's coming from that proxy. */
app.set('trust proxy', true);
app.use(json());
//We're not going to worry about someone peeking into this thing or anything like that because the JSON web token itself is already encrypted.
// So I'm going to put signed on here of false.
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(currentUser);

app.use(createTicketRouter);

app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
