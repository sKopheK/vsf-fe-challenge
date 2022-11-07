import { CoordsLatLong } from 'hooks/useUserLocation.types';
import { get, omit } from 'lodash';
import StorageService from 'services/Storage';
import ApiService from './Api';
import {
  API_URL,
  MILISECOND,
  PARAM_API_KEY,
  PARAM_LATITUDE,
  PARAM_LONGITUDE,
  STORAGE_EXPIRATION,
  STORAGE_KEY,
} from './Weather.constants';
import { StoredWeatherData, WeatherData } from './Weather.types';

class WeatherService {
  apiKey;
  apiService;
  storageService;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Missing API key');
    }
    this.apiKey = apiKey;
    this.apiService = new ApiService();
    this.storageService = new StorageService();
  }

  private getStoredData(latitude: number, longitude: number) {
    const stored = this.storageService.get(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: StoredWeatherData = JSON.parse(stored);
        if (parsed.latitude === latitude && parsed.longitude === longitude) {
          return omit<StoredWeatherData, keyof CoordsLatLong>(parsed, [
            'longitude',
            'latitude',
          ]);
        }
      } catch {}
    }

    return null;
  }

  private storeData(data: WeatherData, latitude: number, longitude: number) {
    this.storageService.set(
      STORAGE_KEY,
      JSON.stringify({ ...data, latitude, longitude }),
      STORAGE_EXPIRATION
    );
  }

  async get(latitude: number, longitude: number): Promise<WeatherData> {
    const stored = this.getStoredData(latitude, longitude);
    if (stored) {
      return stored;
    }

    const params: { [key: string]: number | string } = {
      [PARAM_API_KEY]: this.apiKey,
      [PARAM_LATITUDE]: latitude,
      [PARAM_LONGITUDE]: longitude,
    };
    const parsedUrl = new URL(API_URL);
    Object.keys(params).forEach((key) => {
      parsedUrl.searchParams.append(key, String(params[key]));
    });

    return this.apiService.get(parsedUrl.toString()).then((data) => {
      const fetched: WeatherData = {
        temperature: get(data, 'main.temp', ''),
        main: get(data, 'weather[0].main', ''),
        icon: get(data, 'weather[0].icon', ''),
        humidity: get(data, 'main.humidity', ''),
        windSpeed: get(data, 'wind.speed', ''),
        sunrise: get(data, 'sys.sunrise', 0) * MILISECOND,
        sunset: get(data, 'sys.sunset', 0) * MILISECOND,
      };
      this.storeData(fetched, latitude, longitude);
      return fetched;
    });
  }
}

export default WeatherService;
