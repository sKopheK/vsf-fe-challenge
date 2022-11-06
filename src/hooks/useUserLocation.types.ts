export interface CoordsLatLong {
  latitude: GeolocationCoordinates['latitude'];
  longitude: GeolocationCoordinates['longitude'];
}

export interface UserLocation extends CoordsLatLong {
  city: string;
  region: string;
  country: string;
}
