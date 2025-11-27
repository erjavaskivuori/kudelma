import Weather from './components/weather';
import { useGeoLocation } from './hooks/useGeoLocation';
import { useGetWeatherQuery, useGetKeywordsQuery } from './services/api';

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
  console.log('Keywords:', keywords);

  const isLoading = weatherLoading || keywordsLoading;

  if (isLoading) return <div>Loading...</div>;
  if (weatherError) return <div>Error loading weather</div>;

  return (
      <div>
        <h1></h1>
        {weather && <Weather {...weather} />}
      </div>
  );
};

export default App;
