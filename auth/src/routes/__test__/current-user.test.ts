import request from 'supertest';
import { app } from '../../app';

/*So we are using this global thing right here just to avoid an additional import statement at the top.
Again, if you don't like this, just go ahead and move that sign in function to a separate file and
then import it into the test file. */

it('responds with details about the current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  // console.log(response.body);
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
