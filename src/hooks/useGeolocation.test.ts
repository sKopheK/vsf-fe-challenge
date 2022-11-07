import { renderHook } from '@testing-library/react';
import { getCurrentPositionMock } from '../tests/utils/mockNavigatorGeolocation';
import useGeolocation from './useGeolocation';
import { GEOLOCATION_NOT_AVAILABLE } from './useGeolocation.constants';

describe('useGeolocation Hook', () => {
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

  it('should return unavailable geolocation', () => {
    getCurrentPositionMock.mockImplementation((_, handleError) => {
      return handleError(mockedError);
    });

    const { result } = renderHook(() => useGeolocation());
    expect(result.current).not.toBe(undefined);
    expect(result.current).toEqual(GEOLOCATION_NOT_AVAILABLE);
  });
});
