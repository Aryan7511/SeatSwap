import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res, next) => {
  res.send('hi signout');
});

export { router as signoutRouter };
