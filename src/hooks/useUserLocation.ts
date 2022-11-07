import * as API_KEYS from 'apiKeys';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import useGeoDb from './useGeoDb';
import useGeolocation from './useGeolocation';
import { GEOLOCATION_NOT_AVAILABLE } from './useGeolocation.constants';
import useIpData from './useIpData';
import { FALLBACK } from './useUserLocation.constants';
import { UserLocation } from './useUserLocation.types';

const useUserLocation = () => {
  const geolocation = useGeolocation();
  const getIpData = useIpData(API_KEYS.IP_DATA);
  const getGeoDb = useGeoDb(API_KEYS.RAPID);

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
      getGeoDb(geolocation.latitude, geolocation.longitude)
        .then((geoDbData) => {
          setUserLocation({
            ...geolocation,
            city: get(geoDbData, 'city'),
            region: get(geoDbData, 'region'),
            country: get(geoDbData, 'country'),
          });
        })
        .catch(() => {
          setUserLocation({
            ...geolocation,
            city: '',
            region: '',
            country: '',
          });
        });
    }
  }, [geolocation]);

  return userLocation;
};

export default useUserLocation;
