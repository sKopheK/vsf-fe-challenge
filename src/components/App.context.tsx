import { OPEN_WEATHER_MAP } from 'apiKeys';
import useUserLocation from 'hooks/useUserLocation';
import WeatherService from 'services/Weather';
import { WeatherData } from 'services/Weather.types';

import convertToCelsius from 'helpers/convertToCelsius';
import { createContext, useEffect, useMemo, useState } from 'react';
import { UNIT_CELSIUS, UNIT_FARENHEIT } from './App.constants';
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
  const [weatherData, setWeatherData] = useState<WeatherData>();

  const [unit, setUnit] = useState<AppContextModel['unit']>(
    defaultContextValues.unit as AppContextModel['unit']
  );

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
