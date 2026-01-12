import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { WeatherData, Coordinates } from '../../../shared/types/weather';
import type { Artwork } from '../../../shared/types/art';
import type { Book } from '../../../shared/types/books';
import type { Recipe } from '../../../shared/types/recipe';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: String(import.meta.env.VITE_BACKEND_URL),
  }),
  tagTypes: ['Colors', 'Keywords', 'Weather', 'Artworks', 'Books', 'Recipes'],
  endpoints: (builder) => ({
    getColors: builder.query<string[], string[]>({
      query: (keywords) => ({
        url: '/colors',
        params: { keywords: keywords.join(',') },
      }),
      transformResponse: (response: { colors: string[] }) => response.colors,
      providesTags: ['Colors'],
    }),

    getKeywords: builder.query<Record<string, string[]>, WeatherData>({
      query: (weather) => ({
        url: '/keywords',
        params: { ...weather },
      }),
      transformResponse: (response: { keywords: Record<string, string[]> }) => response.keywords,
      providesTags: ['Keywords'],
    }),

    getWeather: builder.query<WeatherData, Coordinates>({
      query: ({ lat, lon }) => ({
        url: '/weather',
        params: { latitude: lat, longitude: lon },
      }),
      transformResponse: (response: { weather: WeatherData }) => response.weather,
      providesTags: ['Weather'],
    }),

    getArtworks: builder.query<Artwork[], string[]>({
      query: (keywords) => ({
        url: '/art',
        params: { keywords: keywords.join(',') },
      }),
      transformResponse: (response: { artworks: Artwork[] }) => response.artworks,
      providesTags: ['Artworks'],
    }),

    getBooks: builder.query<Book[], string[]>({
      query: (keywords) => ({
        url: '/books',
        params: { keywords: keywords.join(',') },
      }),
      transformResponse: (response: { books: Book[] }) => response.books,
      providesTags: ['Books'],
    }),
    getRecipes: builder.query<Recipe[], string[]>({
      query: (keywords) => ({
        url: '/recipes',
        params: { keywords: keywords.join(',') },
      }),
      transformResponse: (response: { recipes: Recipe[] }) => response.recipes,
      providesTags: ['Recipes'],
    }),
  }),
});

export const { 
  useGetColorsQuery, 
  useGetKeywordsQuery, 
  useGetWeatherQuery,
  useGetArtworksQuery,
  useGetBooksQuery,
  useGetRecipesQuery
} = api;
