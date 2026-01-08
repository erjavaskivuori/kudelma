import express from 'express';
import { getKeywords } from './genAIController.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

const genAiKeywordRouter = express.Router();

genAiKeywordRouter.get('/', asyncWrapper(getKeywords));

export default genAiKeywordRouter;
