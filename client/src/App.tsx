import clsx from 'clsx';
import Weather from './components/weather';
import { useGeoLocation } from './hooks/useGeoLocation';
import {
  useGetWeatherQuery,
  useGetKeywordsQuery,
  useGetColorsQuery,
  useGetArtworksQuery
} from './services/api';
import { useEffect } from 'react';
import { updateColorRange } from './utils/colorManager';
import Masonry from './components/Masonry';

const App = () => {
  const coords = useGeoLocation();
  let itemList = [];

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

  // Update colors when palette changes
  useEffect(() => {
    if (palette && palette.length === 5) {
      console.log('Updating colors with:', palette);
      updateColorRange(palette);
    }
  }, [palette]);

  const isLoading = weatherLoading || keywordsLoading || colorsLoading || artworksLoading;

  if (isLoading) return <div>Loading...</div>;
  if (weatherError) return <div>Error loading weather</div>;

  itemList = artworks?.map(artwork => ({ type: 'artwork', data: artwork })) || [];

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
