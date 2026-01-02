import express from 'express';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { getRecipes } from '../controllers/recipeController.js';

const recipeRouter = express.Router();

recipeRouter.get('/', asyncWrapper(getRecipes));

export default recipeRouter;
