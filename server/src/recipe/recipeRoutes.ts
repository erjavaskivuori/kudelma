import express from 'express';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { getRecipes } from './recipeController.js';

const recipeRouter = express.Router();

recipeRouter.get('/', asyncWrapper(getRecipes));

export default recipeRouter;
