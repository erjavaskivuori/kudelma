import express from 'express';
import { getColorPalette } from '../controllers/colorController.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

const colorRouter = express.Router();

colorRouter.get('/', asyncWrapper(getColorPalette));

export default colorRouter;
