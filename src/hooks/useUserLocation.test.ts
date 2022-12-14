import { renderHook, waitFor } from '@testing-library/react';
import { getCurrentPositionMock } from 'tests/utils/mockNavigatorGeolocation';
import useUserLocation from './useUserLocation';
import { FALLBACK } from './useUserLocation.constants';

describe('useUserLocation Hook', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return fallback data', async () => {
    getCurrentPositionMock.mockImplementation((_, handleError) => {
      return handleError();
    });
    const { result, rerender } = renderHook(() => useUserLocation());
    await waitFor(async () => {
      rerender();
      expect(result.current).toStrictEqual(FALLBACK);
    });
  });

  it('should return empty city, region and country', async () => {
    getCurrentPositionMock.mockImplementation((handleSuccess) => {
      return handleSuccess({
        coords: { latitude: FALLBACK.latitude, longitude: FALLBACK.longitude },
      });
    });

    const { result, rerender } = renderHook(() => useUserLocation());
    await waitFor(async () => {
      rerender();
      expect(result.current).toStrictEqual({
        ...FALLBACK,
        city: '',
        region: '',
        country: '',
      });
    });
  });

  it('should return city data from GeoDb', async () => {
    getCurrentPositionMock.mockImplementation((handleSuccess) => {
      return handleSuccess({
        coords: { latitude: FALLBACK.latitude, longitude: FALLBACK.longitude },
      });
    });
    const geoDbResponse = {
      data: [
        {
          city: 'New Town',
          region: 'Prague',
          country: 'Czech Republic',
        },
      ],
    };
    fetchMock.mockResponse(JSON.stringify(geoDbResponse));

    const { result, rerender } = renderHook(() => useUserLocation());
    await waitFor(async () => {
      rerender();
      expect(result.current).toStrictEqual({
        ...FALLBACK,
        ...geoDbResponse.data[0],
      });
    });
  });
});
