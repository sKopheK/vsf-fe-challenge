import { useState } from 'react';
import {
  API_KEY_PARAM,
  API_URL,
  FIELDS,
  FIELDS_PARAM,
} from './useIpData.constants';
import { IpData } from './useIpData.types';

const useIpData = (apiKey: string) => {
  if (!apiKey) {
    throw new Error('Missing API key');
  }

  const [data, setData] = useState<IpData>();

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
    return fetch(requestUrl.toString())
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Invalid response status: ' + response.statusText);
        }
        return response.json();
      })
      .then((responseJson) => {
        const responseData: IpData = {
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
