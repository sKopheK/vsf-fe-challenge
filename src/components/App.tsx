import { OPEN_WEATHER_MAP } from 'apiKeys';
import useUserLocation from 'hooks/useUserLocation';
import { FC, useEffect, useMemo, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import WeatherService from 'services/Weather';
import { WeatherData } from 'services/Weather.types';
import { APP_TITLE } from './App.constants';

const App: FC = (): JSX.Element => {
  const userLocation = useUserLocation();

  const weather = useMemo(() => new WeatherService(OPEN_WEATHER_MAP), []);
  const [weatherData, setWeatherData] = useState<WeatherData>();

  useEffect(() => {
    if (userLocation) {
      weather
        .get(userLocation.latitude, userLocation.longitude)
        .then((weatherData) => {
          setWeatherData(weatherData);
        })
        .catch();
    }
  }, [userLocation]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{APP_TITLE}</title>
        </Helmet>
      </HelmetProvider>
    </>
  );
};

export default App;
