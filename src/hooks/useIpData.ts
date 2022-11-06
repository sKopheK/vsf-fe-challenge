import { useState } from 'react';
import ApiService from 'services/Api';
import {
  API_KEY_PARAM,
  API_URL,
  FIELDS,
  FIELDS_PARAM,
} from './useIpData.constants';
import { UserLocation } from './useUserLocation.types';

const useIpData = (apiKey: string) => {
  if (!apiKey) {
    throw new Error('Missing API key');
  }

  const [data, setData] = useState<UserLocation>();

  return async () => {
    if (data) {
      return data;
    }

    const requestUrl = new URL(API_URL);
    requestUrl.searchParams.append(API_KEY_PARAM, apiKey);
    requestUrl.searchParams.append(
      FIELDS_PARAM,
      [
        FIELDS.LATITUDE,
        FIELDS.LONGITUDE,
        FIELDS.CITY,
        FIELDS.REGION,
        FIELDS.COUNTRY,
      ].join()
    );
    const apiService = new ApiService();
    return apiService
      .get(requestUrl.toString())
      .then((responseJson) => {
        const responseData: UserLocation = {
          [FIELDS.LATITUDE]: responseJson.latitude,
          [FIELDS.LONGITUDE]: responseJson.longitude,
          [FIELDS.CITY]: responseJson.city,
          [FIELDS.REGION]: responseJson.region,
          [FIELDS.COUNTRY]: responseJson.country_name,
        };
        setData(responseData);
        return responseData;
      })
      .catch(() => {
        setData(undefined);
      });
  };
};

export default useIpData;
