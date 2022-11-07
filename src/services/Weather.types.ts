import { CoordsLatLong } from 'hooks/useUserLocation.types';

export interface WeatherData {
  temperature: number;
  main: string;
  humidity: number;
  windSpeed: number;
  sunrise: Date;
  sunset: Date;
}

export interface StoredWeatherData extends WeatherData, CoordsLatLong {}
