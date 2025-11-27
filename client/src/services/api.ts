import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { WeatherData, Coordinates } from '../../../shared/types/weather';
import type { Artwork } from '../../../shared/types/art';
import type { DisplayBook } from '../../../shared/types/books';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: String(import.meta.env.VITE_BACKEND_URL),
  }),
  tagTypes: ['Keywords', 'Weather', 'Artworks', 'Books'],
  endpoints: (builder) => ({
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

    getBooks: builder.query<DisplayBook[], string[]>({
      query: (keywords) => ({
        url: '/books',
        params: { keywords: keywords.join(',') },
      }),
      transformResponse: (response: { books: DisplayBook[] }) => response.books,
      providesTags: ['Books'],
    }),
  }),
});

export const { 
  useGetKeywordsQuery, 
  useGetWeatherQuery,
  useGetArtworksQuery,
  useGetBooksQuery 
} = api;