import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { WeatherData, Coordinates } from '../../../shared/types/weather';
import type { Artwork } from '../../../shared/types/art';
import type { Book } from '../../../shared/types/books';
import type { Recipe } from '../../../shared/types/recipe';
import type { PostCard } from '../../../shared/types/card';
import type { ProfileCardsResponse } from '../../../shared/types/profile';
import type { RankedResults } from '../../../shared/types/music';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: String(import.meta.env.VITE_BACKEND_URL),
    credentials: 'include',
  }),
  tagTypes: [
    'Colors',
    'Keywords',
    'Weather',
    'Artworks',
    'Books',
    'Recipes',
    'Music',
    'ProfileCards'
  ],
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
    getMusicRecommendations: builder
    .query<RankedResults,{ activity: string; moods: string[]; weatherData: WeatherData }>({
      query: ({ activity, moods, weatherData }) => ({
        url: '/music/spotify/recommendations',
        method: 'POST',
        body: { activity, moods, weatherData },
      }),
      transformResponse: (response: { recommendations: RankedResults }) => response.recommendations,
      providesTags: ['Music'],
    }),

    getRecipes: builder.query<Recipe[], string[]>({
      query: (keywords) => ({
        url: '/recipes',
        params: { keywords: keywords.join(',') },
      }),
      transformResponse: (response: { recipes: Recipe[] }) => response.recipes,
      providesTags: ['Recipes'],
    }),
    getProfileCards: builder.query<ProfileCardsResponse, number>({
      query: (userId) => ({
        url: `/cards/profile/${userId}`,
      }),
      providesTags: (_result, _error, userId) => [{ type: 'ProfileCards', id: userId }],
    }),
    getPublicCards: builder.query<PostCard[], void>({
      query: () => ({
        url: '/cards/public',
      }),
      providesTags: ['ProfileCards'],
    }),
  }),
});

export const {
  useGetColorsQuery,
  useGetKeywordsQuery,
  useGetWeatherQuery,
  useGetArtworksQuery,
  useGetBooksQuery,
  useGetMusicRecommendationsQuery,
  useLazyGetMusicRecommendationsQuery,
  useGetRecipesQuery,
  useGetProfileCardsQuery,
  useGetPublicCardsQuery,
} = api;
