import { HttpError } from '../utils/errors/HttpError.js';
import type { SpoonacularRecipe, SpoonacularRecipeResponse } from './recipeTypes.js';
import type { Recipe } from '../../../shared/types/recipe.js';
import { redis } from '../infra/redis.js';

const SPOONACULAR_API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

const transformRecipe = (recipe: SpoonacularRecipe): Recipe => {
  const transformed: Recipe = {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    servings: recipe.servings,
    vegetarian: recipe.vegetarian,
    vegan: recipe.vegan,
    glutenFree: recipe.glutenFree,
    dairyFree: recipe.dairyFree,
    creditsText: recipe.creditsText,
    sourceUrl: recipe.sourceUrl,
    summary: recipe.summary,
    analyzedInstructions: recipe.analyzedInstructions,
  };
  return transformed;
};

export const fetchRecipes = async (keywords: string[]): Promise<Recipe[]> => {
  const cacheKey = `recipes:${keywords.sort().join(',')}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData) as Recipe[];
  }

  const recipes: Recipe[] = [];

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    throw new HttpError('Spoonacular API key is not configured', 500);
  }

  for (const keyword of keywords) {
    const queryParams = new URLSearchParams({
      apiKey,
      query: keyword.replace(/ /g, '_'),
      number: '4',
      addRecipeInformation: 'true',
      addRecipeInstructions: 'true',
    });

    const response: Response = await fetch(`${SPOONACULAR_API_URL}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new HttpError('Failed to fetch recipes', response.status);
    }

    const data: SpoonacularRecipeResponse = await response.json() as SpoonacularRecipeResponse;

    const recipesForKeyword = data.results.map(transformRecipe);
    recipes.push(...recipesForKeyword);
  }

  // Spoonacular allows caching only for 1 hour
  await redis.set(
    cacheKey, JSON.stringify(recipes),
    { expiration: { type:'EX', value: (60 * 60) } }
  );

  return recipes;
};
