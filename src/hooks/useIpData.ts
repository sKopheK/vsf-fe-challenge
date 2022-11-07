import { get } from 'lodash';
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
          [FIELDS.LATITUDE]: get(responseJson, 'latitude'),
          [FIELDS.LONGITUDE]: get(responseJson, 'longitude'),
          [FIELDS.CITY]: get(responseJson, 'city'),
          [FIELDS.REGION]: get(responseJson, 'region'),
          [FIELDS.COUNTRY]: get(responseJson, 'country_name'),
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
