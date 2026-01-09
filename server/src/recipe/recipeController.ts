import type { Request, Response } from 'express';
import { keywordsQuerySchema } from '../utils/schemas/keywordsSchema.js';
import type { KeywordsQuery } from '../utils/schemas/keywordsSchema.js';
import { validate } from '../utils/validate.js';
import { fetchRecipes } from './recipeService.js';

export const getRecipes = async (req: Request, res: Response) => {
  const validatedQuery = validate<KeywordsQuery>(keywordsQuerySchema, req.query);

  const recipes = await fetchRecipes(validatedQuery.keywords);

  return res.json({ recipes });
};
