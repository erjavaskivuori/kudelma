import express from 'express';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { createCardController } from './cardController.js';
import { requireAuth } from '../utils/middleware.js';

const cardRouter = express.Router();

cardRouter.post('/create', requireAuth, asyncWrapper(createCardController));

export default cardRouter;
