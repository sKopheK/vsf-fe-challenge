import { renderHook } from '@testing-library/react';
import useGeolocation from './useGeolocation';
import { mockNavigatorGeolocation } from '../tests/utils/mockNavigatorGeolocation';
import {
  LATITUDE_FALLBACK,
  LONGITUDE_FALLBACK,
} from './useGeolocation.constants';

describe('useGeolocation Hook', () => {
  const { getCurrentPositionMock } = mockNavigatorGeolocation();

  const mockedCoords: GeolocationCoordinates = {
    accuracy: 0,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: 51.1,
    longitude: 45.3,
    speed: null,
  };
  const mockedError: GeolocationPositionError = {
    ...GeolocationPositionError,
    code: GeolocationPositionError.PERMISSION_DENIED,
    message: '',
  };

  beforeEach(() => {
    getCurrentPositionMock.mockClear();
  });

  it('should return empty coords', () => {
    const { result } = renderHook(() => useGeolocation());
    expect(result.current).toBe(undefined);
  });

  it('should return non-empty coords', () => {
    getCurrentPositionMock.mockImplementation((handleSuccess) => {
      return handleSuccess({ coords: mockedCoords });
    });
    const { result } = renderHook(() => useGeolocation());
    expect(result.current).not.toBe(undefined);
    expect(result.current).toEqual({
      latitude: mockedCoords.latitude,
      longitude: mockedCoords.longitude,
    });
  });

  it('should return fallback coords', () => {
    getCurrentPositionMock.mockImplementation((_, handleError) => {
      return handleError(mockedError);
    });

    const { result } = renderHook(() => useGeolocation());
    expect(result.current).not.toBe(undefined);
    expect(result.current).toEqual({
      latitude: LATITUDE_FALLBACK,
      longitude: LONGITUDE_FALLBACK,
    });
  });
});
