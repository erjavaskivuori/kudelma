import { useState, useEffect } from 'react';
import type { Coordinates } from '../../../shared/types/weather';

export type GeoLocationState = {
  coords: Coordinates | null;
  isLoading: boolean;
  error: string | null;
};

export const useGeoLocation = (): GeoLocationState => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: Math.round(position.coords.latitude * 100) / 100,
          lon: Math.round(position.coords.longitude * 100) / 100,
        });
        setError(null);
        setIsLoading(false);
      },
      (locationError) => {
        console.error('Location error:', locationError);
        setError(
          'Unable to access your location. Please allow location access to load suggestions.',
        );
        setIsLoading(false);
      }
    );
  }, []);

  return { coords, isLoading, error };
};
