import { useGeoLocation } from '../../hooks/useGeoLocation';
import { useGetWeatherQuery } from '../../services/api';
import Weather from './Weather';

const Sidebar = () => {
  const coords = useGeoLocation();

  const { data: weather } = useGetWeatherQuery(
    coords || { lat: 0, lon: 0 },
    { skip: !coords }
  );

  return (
    <aside className="sticky top-0 h-screen p-4">
      {weather && <Weather weather={weather} />}
    </aside>
  );
};

export default Sidebar;
