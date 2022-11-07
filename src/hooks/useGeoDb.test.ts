import { renderHook } from '@testing-library/react';
import useGeoDb from './useGeoDb';
import {
  API_URL,
  LIMIT_PARAM,
  LIMIT_VALUE,
  RAPID_API_KEY_HEADER,
} from './useGeoDb.constants';
import { FALLBACK } from './useUserLocation.constants';

const mockResponse = {
  data: [
    {
      city: 'City',
      region: 'Region',
      country: 'Some kickass country',
    },
  ],
};

describe('useGeoDb Hook', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should throw error on missing API key', () => {
    expect(() =>
      renderHook(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => useGeoDb()
      )
    ).toThrow();
  });

  it('should throw on invalid API key', () => {
    fetchMock.mockResponse('', { status: 400 });
    const { result: hook } = renderHook(() => useGeoDb('totallyWrongApiKey'));
    expect(() => hook.current(44, -44)).rejects.toThrow();
  });

  it('should throw on invalid response', () => {
    fetchMock.mockResponse(JSON.stringify({ whatever: 'test' }));

    const apiKey = 'myCorrectApiKey';

    const { result: hook } = renderHook(() => useGeoDb(apiKey));
    expect(() =>
      hook.current(FALLBACK.latitude, FALLBACK.longitude)
    ).rejects.toThrow();
  });

  it('should call GeoDb with geolocation coords', async () => {
    fetchMock.mockResponse(JSON.stringify(mockResponse));

    const apiKey = 'myCorrectApiKey';
    const latitude = FALLBACK.latitude;
    const longitude = FALLBACK.longitude;
    const geoDbUrl = API_URL.replace(
      /\{iso6709coords\}/,
      [latitude, longitude].join(longitude >= 0 ? '+' : '')
    );
    const parsedUrl = new URL(geoDbUrl);
    parsedUrl.searchParams.append(LIMIT_PARAM, String(LIMIT_VALUE));

    const { result: hook } = renderHook(() => useGeoDb(apiKey));
    await hook.current(latitude, longitude);

    expect(fetchMock).toHaveBeenCalledWith(parsedUrl.toString(), {
      headers: new Headers({
        [RAPID_API_KEY_HEADER]: apiKey,
      }),
    });
  });

  it('should return data from GeoDb', async () => {
    fetchMock.mockResponse(JSON.stringify(mockResponse));
    const latitude = FALLBACK.latitude;
    const longitude = FALLBACK.longitude;

    const { result: hook } = renderHook(() => useGeoDb('myCorrectApiKey'));
    const result = await hook.current(latitude, longitude);

    expect(result).toEqual(mockResponse.data[0]);
  });
});
