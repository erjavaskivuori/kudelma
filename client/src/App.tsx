import clsx from 'clsx';
import type { Item } from '../../shared/types/feed';
import Weather from './components/weather';
import { useGeoLocation } from './hooks/useGeoLocation';
import {
  useGetWeatherQuery,
  useGetKeywordsQuery,
  useGetColorsQuery,
  useGetArtworksQuery,
  useGetBooksQuery,
  useGetRecipesQuery
} from './services/api';
import { useEffect } from 'react';
import { updateColorRange } from './utils/colorManager';
import Masonry from './components/Masonry';

const App = () => {
  const coords = useGeoLocation();

  const { data: weather, 
    isLoading: weatherLoading, 
    error: weatherError 
  } = useGetWeatherQuery(
    coords || { lat: 0, lon: 0 }, 
    { skip: !coords }
  );
  
  const { 
    data: keywords, 
    isLoading: keywordsLoading 
  } = useGetKeywordsQuery(
    weather!,
    { skip: !weather }
  );
  
  const { 
    data: palette, 
    isLoading: colorsLoading 
  } = useGetColorsQuery(
    keywords?.colors || [],
    { skip: !keywords?.colors }
  );

  const { data: artworks, isLoading: artworksLoading } = useGetArtworksQuery(
    keywords?.art || [],
    { skip: !keywords?.art }
  );

  const { data: books, isLoading: booksLoading } = useGetBooksQuery(
    keywords?.books || [],
    { skip: !keywords?.books }
  );

  const { data: recipes, isLoading: recipesLoading } = useGetRecipesQuery(
    keywords?.recipes || [],
    { skip: !keywords?.recipes }
  );

  // Update colors when palette changes
  useEffect(() => {
    if (palette && palette.length === 5) {
      updateColorRange(palette);
    }
  }, [palette]);

  const isLoading = [
    weatherLoading, keywordsLoading, colorsLoading,
    artworksLoading, booksLoading, recipesLoading
  ].some(Boolean);

  if (isLoading) return <div>Loading...</div>;
  if (weatherError) return <div>Error loading weather</div>;

  const itemList: Item[] = [
  ...(artworks?.map(artwork => ({ type: 'artwork' as const, data: artwork })) ?? []),
  ...(books?.map(book => ({ type: 'book' as const, data: book })) ?? []),
  ...(recipes?.map(recipe => ({ type: 'recipe' as const, data: recipe })) ?? [])
  ];

  return (
    <div
      className={clsx(
        'flex px-10 bg-[var(--color-extra-dark)]',
        'items-center justify-center min-h-screen min-w-screen'
      )}
    >
      <div className='md:flex-col-reverse'>
        <h1></h1>
        {weather && <Weather weather={weather} />}
        <Masonry items={itemList} />
      </div>
    </div>
  );
};

export default App;
