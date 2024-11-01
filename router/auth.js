import express from 'express';
import { body } from 'express-validator';
import 'express-async-errors';

import * as authController from '../controller/auth.js';
import { validate } from '../middleware/validator.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

const validateSignup = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('You should enter valid email address')
    .normalizeEmail(),
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 letters')
    .isLowercase()
    .withMessage('Username cannot contain uppercase letters')
    .isAlphanumeric()
    .withMessage('Username can only consist of number and characters'),
  body('password')
    .trim()
    .isLength({ min: 8, max: 30 })
    .withMessage('Password must be between 8 and 30 letters')
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must include an uppercase letter, numbers and symbols'
    ),
  body('name')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Name must be between 1 and 30 letters'),
  body('imgUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please enter valid image URL'),
  validate,
];

const validateLogin = [
  body('username')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Username must be between 1 and 30 letters'),
  body('password')
    .trim()
    .isLength({ min: 8, max: 30 })
    .withMessage('Password must be between 8 and 30 letters'),
  validate,
];

router.post('/signup', validateSignup, authController.signUp);

router.post('/login', validateLogin, authController.logIn);

router.post('/logout', authController.logOut);

router.get('/me', isAuth, authController.me);

router.get('/csrf-token', authController.csrfToken);

export default router;
