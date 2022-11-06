import { useEffect, useState } from 'react';
import {
  LATITUDE_FALLBACK,
  LONGITUDE_FALLBACK,
  MAX_AGE_BROWSER_CACHE,
  TIMEOUT,
} from './useGeolocation.constants';
import { GeolocationLatLong } from './useGeolocation.types';

const useGeolocation = () => {
  const [coords, setCoords] = useState<GeolocationLatLong>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      },
      () => {
        setCoords({
          latitude: LATITUDE_FALLBACK,
          longitude: LONGITUDE_FALLBACK,
        });
      },
      {
        maximumAge: MAX_AGE_BROWSER_CACHE,
        timeout: TIMEOUT,
      }
    );
  }, []);

  return coords;
};

export default useGeolocation;
