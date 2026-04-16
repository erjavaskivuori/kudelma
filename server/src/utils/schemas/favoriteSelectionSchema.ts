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

const postcardMetaSchema = z.object({
  city: z.string().optional(),
  weatherMain: z.string().optional(),
  temperatureCelsius: z.number().optional(),
});

export const favoriteSelectionSchema = z.object({
  book: bookSchema,
  artwork: artworkSchema,
  recipe: recipeSchema,
  postcardMeta: postcardMetaSchema.optional(),
}).refine((data) => !!data.book && !!data.artwork && !!data.recipe,
  { message: 'You must select exactly one book, one artwork, and one recipe.' });

export type FavoriteSelection = z.infer<typeof favoriteSelectionSchema>;
