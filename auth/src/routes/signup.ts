import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@sswaptickets/common';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new BadRequestError('Email in use');
      }

      const user = User.build({ email, password });
      await user.save();

      //Generate JWT
      //!exclamtion telling hey typescript we already check this thing you should not have to worry
      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        process.env.JWT_KEY!
      );

      //Store it on session Object
      req.session = {
        jwt: userJwt
      };

      res.status(201).send(user);
    } catch (error) {
      next(error); // Pass the error to the Error handling middleware
    }
  }
);

export { router as signupRouter };
