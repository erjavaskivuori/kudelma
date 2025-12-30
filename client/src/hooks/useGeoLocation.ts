import { useState, useEffect } from 'react';
import type { Coordinates } from '../../../shared/types/weather';

export const useGeoLocation = (): Coordinates | null => {
  const [coords, setCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: Math.round(position.coords.latitude * 100) / 100,
          lon: Math.round(position.coords.longitude * 100) / 100,
      });
    },
    (error) => console.error('Location error:', error)
    );
  }, []);

  return coords;
};
