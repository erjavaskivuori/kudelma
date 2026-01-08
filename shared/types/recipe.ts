type StepIngredient = {
  id: number;
  name: string;
  localizedName: string;
  image: string;
}

type StepEquipment = {
  id: number;
  name: string;
  localizedName: string;
  image: string;
}

type StepLength = {
  number: number;
  unit: string;
}

type RecipeStep = {
  number: number;
  step: string;
  ingredients: StepIngredient[];
  equipment: StepEquipment[];
  length?: StepLength;
}

export type AnalyzedInstruction = {
  name: string;
  steps: RecipeStep[];
}

export type Recipe = {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  creditsText: string;
  sourceUrl: string;
  summary: string;
  analyzedInstructions: AnalyzedInstruction[];
}
