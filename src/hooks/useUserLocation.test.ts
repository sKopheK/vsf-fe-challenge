import { renderHook, waitFor } from '@testing-library/react';
import * as API_KEYS from 'apiKeys';
import { mockNavigatorGeolocation } from 'tests/utils/mockNavigatorGeolocation';
import useUserLocation from './useUserLocation';
import {
  FALLBACK,
  GEO_DB_API_URL,
  GEO_DB_LIMIT_PARAM,
  GEO_DB_LIMIT_VALUE,
  GEO_DB_RAPID_API_KEY_HEADER,
} from './useUserLocation.constants';

describe('useUserLocation Hook', () => {
  const { getCurrentPositionMock } = mockNavigatorGeolocation();

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

  it('should call GeoDb with geolocation coords', async () => {
    getCurrentPositionMock.mockImplementation((handleSuccess) => {
      return handleSuccess({
        coords: { latitude: FALLBACK.latitude, longitude: FALLBACK.longitude },
      });
    });

    const { rerender } = renderHook(() => useUserLocation());
    await waitFor(async () => {
      rerender();

      const geoDbUrl = GEO_DB_API_URL.replace(
        /\{iso6709coords\}/,
        [FALLBACK.latitude, FALLBACK.longitude].join(
          FALLBACK.longitude >= 0 ? '+' : ''
        )
      );

      const parsedUrl = new URL(geoDbUrl);
      parsedUrl.searchParams.append(
        GEO_DB_LIMIT_PARAM,
        String(GEO_DB_LIMIT_VALUE)
      );

      expect(fetchMock).toHaveBeenCalledWith(parsedUrl.toString(), {
        headers: new Headers({
          [GEO_DB_RAPID_API_KEY_HEADER]: API_KEYS.RAPID,
        }),
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
