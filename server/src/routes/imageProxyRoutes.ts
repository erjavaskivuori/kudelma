import express from 'express';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { proxyImage } from '../controllers/imageProxyController.js';

const imageProxyRouter = express.Router();

imageProxyRouter.get('/', asyncWrapper(proxyImage));

export default imageProxyRouter;
