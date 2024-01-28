import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', (req, res, next) => {
  res.send('hi current user is aryan');
});

export { router as currentUserRouter };
