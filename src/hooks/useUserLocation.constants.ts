import { UserLocation } from './useUserLocation.types';

export const FALLBACK: UserLocation = {
  latitude: 39.4697064,
  longitude: 0.3763353,
  city: 'Valencia',
  region: 'Valencia',
  country: 'Spain',
};

export const GEO_DB_API_URL =
  'https://wft-geo-db.p.rapidapi.com/v1/geo/locations/{iso6709coords}/nearbyCities';
export const GEO_DB_LIMIT_PARAM = 'limit';
export const GEO_DB_LIMIT_VALUE = 1;
export const GEO_DB_RAPID_API_KEY_HEADER = 'X-RapidAPI-Key';
