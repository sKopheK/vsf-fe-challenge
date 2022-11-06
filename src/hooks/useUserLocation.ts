import * as API_KEYS from 'apiKeys';
import { useEffect, useState } from 'react';
import useGeolocation from './useGeolocation';
import { GEOLOCATION_NOT_AVAILABLE } from './useGeolocation.constants';
import useIpData from './useIpData';
import { FALLBACK } from './useUserLocation.constants';
import { UserLocation } from './useUserLocation.types';

const useUserLocation = () => {
  const geolocation = useGeolocation();
  const getIpData = useIpData(API_KEYS.IP_DATA);

  const [userLocation, setUserLocation] = useState<UserLocation>();

  useEffect(() => {
    if (geolocation === GEOLOCATION_NOT_AVAILABLE) {
      const fetchIpData = async () => {
        const ipData = await getIpData();
        if (ipData) {
          setUserLocation(ipData);
        } else {
          setUserLocation(FALLBACK);
        }
      };
      fetchIpData();
    } else if (geolocation) {
      setUserLocation({
        ...geolocation,
        city: '',
        region: '',
        country: '',
      });
    }
  }, [geolocation]);

  return userLocation;
};

export default useUserLocation;
