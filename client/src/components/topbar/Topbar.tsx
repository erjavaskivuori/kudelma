import { useState } from 'react';
import { Link } from 'react-router';
import { IoMenuOutline } from "react-icons/io5";
import { BsPersonCircle } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { logout } from '../../services/user/userSlice';
import { useGeoLocation } from '../../hooks/useGeoLocation';
import { useGetWeatherQuery } from '../../services/api';
import WeatherCompact from './Weather';

const TopBar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const { coords } = useGeoLocation();
  const { data: weather } = useGetWeatherQuery(
    coords ?? { lat: 0, lon: 0 },
    { skip: !coords }
  );
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex flex-col
      bg-(--color-extra-dark)/80 backdrop-blur-sm"
    >
      {/* Always-visible bar */}
      <div className="relative flex items-center justify-between px-6 py-4">

        {/* Mobile only: Kudelma title (normal-flow, left) */}
        <Link to="/" className="md:hidden text-white text-lg font-bold tracking-wide">
          Kudelma
        </Link>

        {/* Desktop only: weather (left) */}
        <div className="hidden md:flex items-center">
          {weather && <WeatherCompact weather={weather} />}
        </div>

        {/* Desktop only: Kudelma (absolute centre) */}
        <Link
          to="/"
          className="hidden md:block absolute left-1/2 -translate-x-1/2
            text-white text-lg font-bold tracking-wide"
        >
          Kudelma
        </Link>

        {/* Desktop only: right-side nav */}
        <div className="hidden md:flex items-center gap-4 text-sm text-white">
          {user ? (
            <Link
              to={`/profile/${user.id}`}
              className="flex items-center gap-2 hover:text-gray-300">
              <BsPersonCircle className="w-5 h-5" /> {user.name}
            </Link>
          ) : (
            <Link to="/login" className="hover:text-gray-300">Login</Link>
          )}
          {user ? (
            <button
              onClick={() => void dispatch(logout())}
              className="text-gray-400 hover:text-white flex items-center gap-2"
            >
              <IoMdLogOut className="w-5 h-5" /> Logout
            </button>
          ) : (
            <Link to="/register" className="hover:text-gray-300">Register</Link>
          )}
        </div>

        {/* Mobile only: hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 w-10 h-10
            text-white rounded-base hover:bg-white/10
            focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="sr-only">Open main menu</span>
          <IoMenuOutline className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-5 text-sm text-white">
          {weather && (
            <div className="pt-3">
              <WeatherCompact weather={weather} />
            </div>
          )}

          {user ? (
            <Link
              to={`/profile/${user.id}`}
              className="hover:text-gray-300 flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <BsPersonCircle className="w-5 h-5" /> {user.name}
            </Link>
          ) : (
            <Link to="/login" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}

          {user ? (
            <button
              className="text-left text-gray-400 hover:text-white flex items-center gap-2"
              onClick={() => { void dispatch(logout()); setMenuOpen(false); }}
            >
              <IoMdLogOut className="w-5 h-5" /> Logout
            </button>
          ) : (
            <Link to="/register" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          )}
          <line className="border-t border-white/20" />
        </div>
      )}
    </header>
  );
};

export default TopBar;
