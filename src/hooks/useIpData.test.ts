import { renderHook, waitFor } from '@testing-library/react';
import StorageService from 'services/Storage';
import useIpData from './useIpData';
import { FIELDS } from './useIpData.constants';
import { UserLocation } from './useUserLocation.types';

describe('useIpData Hook', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    const storageService = new StorageService();
    storageService.clear();
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
      latitude: mockedData[FIELDS.LATITUDE],
      longitude: mockedData[FIELDS.LONGITUDE],
      city: mockedData[FIELDS.CITY],
      region: mockedData[FIELDS.REGION],
      country: mockedData[FIELDS.COUNTRY],
    } as UserLocation);
  });

  it('should not call fetch when asking for data after first fetch request', async () => {
    const mockedResponse = {
      [FIELDS.LATITUDE]: 9,
      [FIELDS.LONGITUDE]: 5,
      [FIELDS.CITY]: 'London',
      [FIELDS.REGION]: 'Londonshire',
      [FIELDS.COUNTRY]: 'UK',
    };
    const mockedData: UserLocation = {
      latitude: mockedResponse[FIELDS.LATITUDE],
      longitude: mockedResponse[FIELDS.LONGITUDE],
      city: mockedResponse[FIELDS.CITY],
      region: mockedResponse[FIELDS.REGION],
      country: mockedResponse[FIELDS.COUNTRY],
    };
    fetchMock.mockResponse(JSON.stringify(mockedResponse));
    const { result: hook, rerender } = renderHook(() =>
      useIpData('myCorrectApiKey')
    );
    const result = await hook.current();
    expect(result).toEqual(mockedData);
    await waitFor(async () => {
      rerender();
      const result2 = await hook.current();
      expect(result2).toEqual(mockedData);
      const result3 = await hook.current();
      expect(result3).toEqual(mockedData);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
