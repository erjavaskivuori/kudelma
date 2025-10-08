import express from 'express';
import { getArtworks } from '../controllers/artController.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

const artRouter = express.Router();

artRouter.get('/', asyncWrapper(getArtworks));

export default artRouter;
