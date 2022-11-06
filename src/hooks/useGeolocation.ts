import { useEffect, useState } from 'react';
import {
  GEOLOCATION_NOT_AVAILABLE,
  MAX_AGE_BROWSER_CACHE,
  TIMEOUT,
} from './useGeolocation.constants';
import { GeolocationNotAvailable } from './useGeolocation.types';
import { CoordsLatLong } from './useUserLocation.types';

const useGeolocation = () => {
  const [coords, setCoords] = useState<
    CoordsLatLong | GeolocationNotAvailable
  >();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      },
      () => {
        setCoords(GEOLOCATION_NOT_AVAILABLE);
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
