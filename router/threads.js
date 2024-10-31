import express from 'express';
import { body } from 'express-validator';
import 'express-async-errors';

import * as threadsController from '../controller/threads.js';
import { validate } from '../middleware/validator.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

const validateThread = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Text must be between 1 and 500 characters'),
  validate,
];

router.get('/', isAuth, threadsController.getThreads);

router.get('/:id', isAuth, threadsController.getThreadById);

router.post('/', isAuth, validateThread, threadsController.createThread);

router.put('/:id', isAuth, validateThread, threadsController.updateThread);

router.delete('/:id', isAuth, threadsController.removeThread);

export default router;
