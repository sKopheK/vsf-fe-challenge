import { OPEN_WEATHER_MAP } from 'apiKeys';
import convertToCelsius from 'helpers/convertToCelsius';
import useUserLocation from 'hooks/useUserLocation';
import { createContext, useEffect, useMemo, useState, useRef } from 'react';
import StorageService from 'services/Storage';
import WeatherService from 'services/Weather';
import { WeatherData } from 'services/Weather.types';
import {
  UNIT_CELSIUS,
  UNIT_FARENHEIT,
  UNIT_STORAGE_KEY,
} from './App.constants';
import { AppContextModel, AppContextProps } from './App.types';

const defaultContextValues: AppContextModel = {
  unit: UNIT_FARENHEIT,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUnit: () => {},
};

export const AppContext = createContext(defaultContextValues);

const AppContextProvider: React.FC<AppContextProps> = (
  props: AppContextProps
): JSX.Element => {
  const userLocation = useUserLocation();

  const weatherService = useMemo(
    () => new WeatherService(OPEN_WEATHER_MAP),
    []
  );
  const storageService = useMemo(() => new StorageService(), []);
  const [weatherData, setWeatherData] = useState<WeatherData>();

  const [unit, setUnit] = useState<AppContextModel['unit']>(
    defaultContextValues.unit as AppContextModel['unit']
  );

  const firstLoad = useRef(true);

  useEffect(() => {
    const storedUnit = storageService.get(UNIT_STORAGE_KEY);
    if (storedUnit) {
      setUnit(JSON.parse(storedUnit));
    }
  }, []);

  useEffect(() => {
    if (!firstLoad.current) {
      storageService.set(UNIT_STORAGE_KEY, JSON.stringify(unit));
    } else {
      firstLoad.current = false;
    }
  }, [unit]);

  useEffect(() => {
    if (userLocation) {
      weatherService
        .get(userLocation.latitude, userLocation.longitude)
        .then((weatherData) => {
          setWeatherData(weatherData);
        })
        .catch();
    }
  }, [userLocation]);

  const contextModel: AppContextModel = {
    ...userLocation,
    ...weatherData,
    temperature:
      unit === UNIT_CELSIUS
        ? convertToCelsius(weatherData?.temperature)
        : weatherData?.temperature,
    unit,
    setUnit,
  };

  return (
    <AppContext.Provider value={contextModel}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
