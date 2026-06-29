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

const playlistSchema = z.object({
  id: z.string(),
  title: z.string(),
  spotifyUrl: z.string(),
});

const trackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artists: z.string().array(),
  spotifyUrl: z.string(),
});

const artistSchema = z.object({
  id: z.string(),
  name: z.string(),
  spotifyUrl: z.string(),
});

export const favoriteSelectionSchema = z.object({
  book: bookSchema.optional(),
  artwork: artworkSchema,
  recipe: recipeSchema.optional(),
  postcardMeta: postcardMetaSchema.optional(),
  playlist: playlistSchema.optional(),
  track: trackSchema.optional(),
  artist: artistSchema.optional(),
}).refine((data) => !!data.artwork,
  { message: 'You must select an artwork to create a card.' });

export type FavoriteSelection = z.infer<typeof favoriteSelectionSchema>;
