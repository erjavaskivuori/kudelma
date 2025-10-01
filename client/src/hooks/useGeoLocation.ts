import { useState, useEffect } from 'react';
import type { Coordinates } from '../../../shared/types/weather';

export const useGeoLocation = (): Coordinates | null => {
  const [coords, setCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
      });
    },
    (error) => console.error('Location error:', error)
    );
  }, []);

  return coords;
};
