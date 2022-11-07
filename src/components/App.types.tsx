import { UserLocation } from 'hooks/useUserLocation.types';
import { Dispatch, SetStateAction } from 'react';
import { WeatherData } from 'services/Weather.types';
import { UNIT_CELSIUS, UNIT_FARENHEIT } from './App.constants';

export interface AppContextProps {
  children?: React.ReactNode;
}
export interface AppContextModel
  extends Partial<WeatherData>,
    Partial<UserLocation> {
  unit: typeof UNIT_CELSIUS | typeof UNIT_FARENHEIT;
  setUnit: Dispatch<SetStateAction<AppContextModel['unit']>>;
}
