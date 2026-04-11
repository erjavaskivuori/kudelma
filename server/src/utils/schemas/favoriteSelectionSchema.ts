import { z } from 'zod';

const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  authors: z.string().array(),
  year: z.number().nullable().optional(),
});

const artworkSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.number().nullable().optional(),
  imageUrl: z.string(),
  authors: z.string().array(),
  buildings: z.string().array().nullable().optional(),
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
}).refine((data) => !!data.book && !!data.artwork && !!data.recipe,
  { message: 'You must select exactly one book, one artwork, and one recipe.' });

export type FavoriteSelection = z.infer<typeof favoriteSelectionSchema>;
