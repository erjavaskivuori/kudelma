import express from 'express';
import { getWeather } from '../controllers/weatherController.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

const weatherRouter = express.Router();

weatherRouter.get('/', asyncWrapper(getWeather));

export default weatherRouter;