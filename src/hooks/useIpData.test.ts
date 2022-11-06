import { renderHook, waitFor } from '@testing-library/react';
import useIpData from './useIpData';
import { FIELDS } from './useIpData.constants';

describe('useIpData Hook', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should throw error on missing API key', () => {
    expect(() =>
      renderHook(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => useIpData()
      )
    ).toThrow();
  });

  it('should return empty result on invalid API key', async () => {
    fetchMock.mockResponse('', { status: 400 });
    const { result: hook } = renderHook(() => useIpData('totallyWrongApiKey'));
    const result = await hook.current();
    expect(result).toBe(undefined);
  });

  it('should return data', async () => {
    const mockedData = {
      latitude: 0,
      longitude: 0,
      city: 'London',
      region: 'Londonshire',
      country_name: 'UK',
    };
    fetchMock.mockResponse(JSON.stringify(mockedData));
    const { result: hook } = renderHook(() => useIpData('myCorrectApiKey'));
    const result = await hook.current();
    expect(result).toStrictEqual({
      [FIELDS.LATITUDE]: mockedData.latitude,
      [FIELDS.LONGITUDE]: mockedData.longitude,
      [FIELDS.CITY]: mockedData.city,
      [FIELDS.REGION]: mockedData.region,
      [FIELDS.COUNTRY]: mockedData.country_name,
    });
  });

  it('should not call fetch when asking for data after first fetch request', async () => {
    const mockedCoords = { latitude: 44, longitude: 15 };
    fetchMock.mockResponse(JSON.stringify(mockedCoords));
    const { result: hook, rerender } = renderHook(() =>
      useIpData('myCorrectApiKey')
    );
    const result = await hook.current();
    expect(result).toEqual(mockedCoords);
    await waitFor(async () => {
      rerender();
      const result2 = await hook.current();
      expect(result2).toEqual(mockedCoords);
      const result3 = await hook.current();
      expect(result3).toEqual(mockedCoords);
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
});
