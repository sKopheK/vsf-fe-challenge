import * as API_KEYS from 'apiKeys';
import { useEffect, useState } from 'react';
import ApiService from 'services/Api';
import useGeolocation from './useGeolocation';
import { GEOLOCATION_NOT_AVAILABLE } from './useGeolocation.constants';
import useIpData from './useIpData';
import {
  FALLBACK,
  GEO_DB_API_URL,
  GEO_DB_LIMIT_PARAM,
  GEO_DB_LIMIT_VALUE,
  GEO_DB_RAPID_API_KEY_HEADER,
} from './useUserLocation.constants';
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
      const geoDbUrl = GEO_DB_API_URL.replace(
        /\{iso6709coords\}/,
        [geolocation.latitude, geolocation.longitude].join(
          geolocation.longitude >= 0 ? '+' : ''
        )
      );
      const geoDbRequestParams = {
        [GEO_DB_LIMIT_PARAM]: String(GEO_DB_LIMIT_VALUE),
      };
      const geoDbRequestOptions = {
        headers: new Headers({
          [GEO_DB_RAPID_API_KEY_HEADER]: API_KEYS.RAPID,
        }),
      };
      const apiService = new ApiService();
      apiService
        .get(geoDbUrl, geoDbRequestParams, geoDbRequestOptions)
        .then((response) => {
          if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid response');
          }
          const { city, region, country } = response.data.pop();

          setUserLocation({
            ...geolocation,
            city,
            region,
            country,
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
