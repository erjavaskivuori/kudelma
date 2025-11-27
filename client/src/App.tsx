import Weather from './components/weather';
import { useGeoLocation } from './hooks/useGeoLocation';
import { useGetWeatherQuery, useGetKeywordsQuery, useGetColorsQuery } from './services/api';
import { useEffect } from 'react';
import { updateColorRange } from './utils/colorManager';

const App = () => {
  const coords = useGeoLocation();

  const { 
    data: weather, 
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

  // Update colors when palette changes
  useEffect(() => {
    if (palette && palette.length === 5) {
      console.log('Updating colors with:', palette);
      updateColorRange(palette);
    }
  }, [palette]);

  const isLoading = weatherLoading || keywordsLoading || colorsLoading;

  if (isLoading) return <div>Loading...</div>;
  if (weatherError) return <div>Error loading weather</div>;

  return (
    <div className='flex bg-[var(--color-extra-light)] items-center justify-center min-h-screen'>
      <div className={
        'mx-auto flex h-screen max-w-[1100px] flex-row ' +
        'items-center justify-center ' +
        'md:flex-col-reverse'
      }>
        <h1></h1>
        {weather && <Weather {...weather} />}
      </div>
    </div>
  );
};

export default App;
