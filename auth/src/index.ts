import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

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
    secure: true
  })
);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDb');
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!');
  });
};

start();
