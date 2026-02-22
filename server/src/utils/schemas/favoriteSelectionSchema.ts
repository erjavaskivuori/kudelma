import { z } from 'zod';

const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  authors: z.string().array(),
  year: z.number().optional(),
});

const artworkSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  year: z.number().optional(),
  imageUrl: z.string(),
  authors: z.string().array(),
  buildings: z.string().array(),
  copyright: z.string(),
});

const recipeSchema = z.object({
  id: z.number(),
  title: z.string(),
  sourceUrl: z.string(),
});

export const favoriteSelectionSchema = z.object({
  book: bookSchema,
  artwork: artworkSchema,
  recipe: recipeSchema,
});

export type FavoriteSelection = z.infer<typeof favoriteSelectionSchema>;
