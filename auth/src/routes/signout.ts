import express from 'express';

const router = express.Router();

/*So what does it really mean to sign out a user?
Well, essentially, we're going to send back a header that's going to tell the user's browser to dump
all the information inside that cookie, just empty it out.
And that's going to remove the JSON web token.
That means any time the user makes a follow up request, there will be no token included inside that cookie. */

router.post('/api/users/signout', (req, res, next) => {
  req.session = null;
  res.send({});
});

export { router as signoutRouter };
