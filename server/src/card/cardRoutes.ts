import express from 'express';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { createCardController, getProfileCardsController } from './cardController.js';
import { optionalAuth, requireAuth } from '../utils/middleware.js';

const cardRouter = express.Router();

cardRouter.get('/profile/:userId', optionalAuth, asyncWrapper(getProfileCardsController));

cardRouter.post('/create', requireAuth, asyncWrapper(createCardController));

export default cardRouter;
