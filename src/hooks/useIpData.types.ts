import { CoordsLatLong } from './useGeolocation.types';

export interface IpData extends CoordsLatLong {
  city: string;
  region: string;
  country: string;
}
