//super test is the thing that's going to allow us to fake a request to the express application.
import request from 'supertest';
import { app } from '../../app';

/*Now you will notice that I marked this function as async, even though we did not use the await keyword inside of here.
I'm just doing that out of habit.
We will eventually attempt to make multiple requests inside of a single test.
When we do, we're going to have to start to use the await keyword.
And so I found that it's easier to just add on async from the get go and not have to worry about adding
on adding it on at some point in the future or forgetting to add it on and being given some kind of error. */

it('returns a 201 on successful signup', async () => {
  //here whether you write return does not matter it will await behind the scene. but as only request is here
  // so you can use return keyword but if multiple request there then use await keyword so that they wait for following requests but in the last request
  // still you can use return bcoz that will be awaited by default behind the scene
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'tfasdfdsf',
      password: 'password'
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'tfasdfdsf',
      password: 'p'
    })
    .expect(400);
});

//you can use await or return statement either of them no problem in any of the above it ones

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com'
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password'
    })
    .expect(400);
});

it('disallows duplicates emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

it('sets a cookie after a succesful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  //get() is a method that is built into the response that allows us to look up any of the headers that have been set in the response.
  // The header that we are going to try to look up is set dash cookie like.
  expect(response.get('Set-Cookie')).toBeDefined();
});
