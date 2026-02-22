import { Link } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { logout } from '../../services/userSlice';
import { useGeoLocation } from '../../hooks/useGeoLocation';
import { useGetWeatherQuery } from '../../services/api';
import WeatherCompact from './Weather';

const TopBar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const coords = useGeoLocation();
  const { data: weather } = useGetWeatherQuery(
    coords ?? { lat: 0, lon: 0 },
    { skip: !coords }
  );

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-3 py-4
    bg-[var(--color-extra-dark)]/80 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between w-full px-10">
        {/* Left — weather */}
        <div className="flex items-center gap-3">
          {weather && <WeatherCompact weather={weather} />}
        </div>

        {/* Center — title */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-white text-lg
        font-bold tracking-wide"
        >
          Kudelma
        </Link>

        {/* Right — user */}
        <div className="flex items-center gap-4 text-sm text-white">
          {user ? (
            <>
              <span>{user.name}</span>
              <button
                onClick={() => void dispatch(logout())}
                className="text-gray-400 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
