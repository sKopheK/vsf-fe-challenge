import { get } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import ApiService from 'services/Api';
import StorageService from 'services/Storage';
import {
  API_KEY_PARAM,
  API_URL,
  FIELDS,
  FIELDS_PARAM,
  STORAGE_KEY,
} from './useIpData.constants';
import { UserLocation } from './useUserLocation.types';

const useIpData = (apiKey: string) => {
  if (!apiKey) {
    throw new Error('Missing API key');
  }

  const [data, setData] = useState<UserLocation>();
  const storageService = useMemo(() => new StorageService(), []);
  const storedData = useMemo(() => storageService.get(STORAGE_KEY), []);

  useEffect(() => {
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, [storedData]);

  return async () => {
    if (data) {
      return data;
    }

    const requestParams = {
      [API_KEY_PARAM]: apiKey,
      [FIELDS_PARAM]: [
        FIELDS.LATITUDE,
        FIELDS.LONGITUDE,
        FIELDS.CITY,
        FIELDS.REGION,
        FIELDS.COUNTRY,
      ].join(),
    };
    const apiService = new ApiService();
    return apiService
      .get(API_URL, requestParams)
      .then((responseJson) => {
        const responseData: UserLocation = {
          latitude: get(responseJson, FIELDS.LATITUDE),
          longitude: get(responseJson, FIELDS.LONGITUDE),
          city: get(responseJson, FIELDS.CITY),
          region: get(responseJson, FIELDS.REGION),
          country: get(responseJson, FIELDS.COUNTRY),
        };
        setData(responseData);
        storageService.set(STORAGE_KEY, JSON.stringify(responseData));
        return responseData;
      })
      .catch(() => {
        setData(undefined);
      });
  };
};

export default useIpData;
