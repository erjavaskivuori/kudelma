import express from 'express';
import { getArtworks, proxyImage } from '../controllers/artController.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

const artRouter = express.Router();

artRouter.get('/', asyncWrapper(getArtworks));

artRouter.get('/image', asyncWrapper(proxyImage));

export default artRouter;
