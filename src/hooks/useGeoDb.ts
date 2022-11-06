import { useCallback } from 'react';
import ApiService from 'services/Api';
import {
  API_URL,
  LIMIT_PARAM,
  LIMIT_VALUE,
  RAPID_API_KEY_HEADER,
} from './useGeoDb.constants';

const useGeoDb = (apiKey: string) => {
  if (!apiKey) {
    throw new Error('Missing API key');
  }

  return useCallback(
    async (latitude: number, longitude: number) => {
      const urlWithCoords = API_URL.replace(
        /\{iso6709coords\}/,
        [latitude, longitude].join(longitude >= 0 ? '+' : '')
      );
      const params = {
        [LIMIT_PARAM]: String(LIMIT_VALUE),
      };
      const requestOptions = {
        headers: new Headers({
          [RAPID_API_KEY_HEADER]: apiKey,
        }),
      };
      const apiService = new ApiService();
      return apiService
        .get(urlWithCoords, params, requestOptions)
        .then((response) => {
          if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid response');
          }
          return response.data.pop();
        });
    },
    [apiKey]
  );
};

export default useGeoDb;
