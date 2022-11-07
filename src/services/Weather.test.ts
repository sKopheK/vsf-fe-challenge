import WeatherService from './Weather';
import {
  API_URL,
  PARAM_API_KEY,
  PARAM_LATITUDE,
  PARAM_LONGITUDE,
} from './Weather.constants';
import { WeatherData } from './Weather.types';

const mockWeatherData = {
  weather: {
    main: 'Clouds',
  },
  main: {
    temp: 282,
    humidity: 51,
  },
  wind: { speed: 1.75 },
  sys: {
    sunrise: new Date(),
    sunset: new Date(),
  },
};

describe('Weather Service', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should throw error on missing API key', () => {
    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      () => new WeatherService()
    ).toThrow();
  });

  it('should call endpoint with passed params', () => {
    fetchMock.mockResponse(JSON.stringify({ test: 44 }));
    const params: { [key: string]: number | string } = {
      [PARAM_API_KEY]: 'myApiKey',
      [PARAM_LATITUDE]: 12.5,
      [PARAM_LONGITUDE]: -55,
    };
    const parsedUrl = new URL(API_URL);
    Object.keys(params).forEach((key) => {
      parsedUrl.searchParams.append(key, String(params[key]));
    });

    const weatherService = new WeatherService(params[PARAM_API_KEY] as string);
    weatherService.get(
      params[PARAM_LATITUDE] as number,
      params[PARAM_LONGITUDE] as number
    );

    expect(fetchMock).toHaveBeenCalledWith(parsedUrl.toString(), undefined);
  });

  it('should return data from endpoint', async () => {
    fetchMock.mockResponse(JSON.stringify(mockWeatherData));
    const weatherService = new WeatherService('myApiKey');

    const result = await weatherService.get(-55, 4);
    expect(result).toStrictEqual({
      temperature: mockWeatherData.main.temp,
      main: mockWeatherData.weather.main,
      humidity: mockWeatherData.main.humidity,
      windSpeed: mockWeatherData.wind.speed,
      sunrise: mockWeatherData.sys.sunrise,
      sunset: mockWeatherData.sys.sunset,
    } as WeatherData);
  });

  it('should not fire request when asking for data at same coords', async () => {
    fetchMock.mockResponse(JSON.stringify(mockWeatherData));
    const weatherService = new WeatherService('myApiKey');
    const latitude = 11;
    const longitude = 12;

    await weatherService.get(latitude, longitude);
    await weatherService.get(latitude, longitude);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
