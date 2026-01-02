// UI data feed types
import type { Artwork } from "./art";
import type { DisplayBook as Book } from "./books";
import type { Recipe } from "./recipe";

export type Item = 
  | { type: 'artwork'; data: Artwork }
  | { type: 'book'; data: Book }
  | { type: 'recipe'; data: Recipe };
