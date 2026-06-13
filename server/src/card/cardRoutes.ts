import express from 'express';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import {
  createCardController,
  getProfileCardsController,
  updateCardsVisibilityController,
  removeCardController
} from './cardController.js';
import { optionalAuth, requireAuth } from '../utils/middleware.js';

const cardRouter = express.Router();

cardRouter.get('/profile/:userId', optionalAuth, asyncWrapper(getProfileCardsController));

cardRouter.post('/create', requireAuth, asyncWrapper(createCardController));

cardRouter.patch('/visibility', requireAuth, asyncWrapper(updateCardsVisibilityController));

cardRouter.delete('/remove/:cardId', requireAuth, asyncWrapper(removeCardController));

export default cardRouter;
