import { useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from './common';
import { 
  fetchWeatherData, 
  selectWeatherData, 
  selectWeatherLoading, 
  selectWeatherError,
} from '../reducers/weatherSlice';
import type { UseWeatherReturn, Coordinates } from '../../../shared/types/weather';

export const useWeather = (coords: Coordinates | null): UseWeatherReturn => {
  const dispatch = useAppDispatch();
  const weather = useAppSelector(selectWeatherData);
  const loading = useAppSelector(selectWeatherLoading);
  const error = useAppSelector(selectWeatherError);

  const shouldFetch = useMemo(() => {
    if (!coords) return false;
    if (!weather) return true;
  }, [coords, weather]);

  useEffect(() => {
    if (shouldFetch && coords) {
      void dispatch(fetchWeatherData(coords));
    }
  }, [shouldFetch, coords, dispatch]);

  return {
    weather,
    loading,
    error,
  };
};
