import { CoordsLatLong } from 'hooks/useUserLocation.types';

export interface WeatherData {
  temperature: number;
  main: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  sunrise: number;
  sunset: number;
}

export interface StoredWeatherData extends WeatherData, CoordsLatLong {}
