import { renderHook, waitFor } from '@testing-library/react';
import { FALLBACK } from './useUserLocation.constants';
import useUserLocation from './useUserLocation';
import { mockNavigatorGeolocation } from 'tests/utils/mockNavigatorGeolocation';

describe('useUserLocation Hook', () => {
  const { getCurrentPositionMock } = mockNavigatorGeolocation();

  beforeAll(() => {
    getCurrentPositionMock.mockImplementation((_, handleError) => {
      return handleError();
    });
  });

  // TODO

  // it('should return fallback data', async () => {
  //   const { result, rerender } = renderHook(() => useUserLocation());
  //   await waitFor(
  //     async () => {
  //       rerender();
  //       expect(result.current).toStrictEqual(FALLBACK);
  //     },
  //     { timeout: 3000 }
  //   );
  // });
});
