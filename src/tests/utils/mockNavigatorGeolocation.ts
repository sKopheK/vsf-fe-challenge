class GeolocationPositionErrorMock extends Error {
  readonly code: number | undefined;
  readonly message!: string;
  readonly PERMISSION_DENIED = 1;
  readonly POSITION_UNAVAILABLE = 2;
  readonly TIMEOUT = 3;
  public x = 'x';

  constructor(message?: string) {
    super(message);
  }
}

export const mockNavigatorGeolocation = () => {
  const clearWatchMock = jest.fn();
  const getCurrentPositionMock = jest.fn();
  const watchPositionMock = jest.fn();

  const geolocation = {
    clearWatch: clearWatchMock,
    getCurrentPosition: getCurrentPositionMock,
    watchPosition: watchPositionMock,
  };

  Object.defineProperty(global.navigator, 'geolocation', {
    value: geolocation,
  });
  Object.defineProperty(global, 'GeolocationPositionError', {
    value: GeolocationPositionErrorMock,
  });

  return { clearWatchMock, getCurrentPositionMock, watchPositionMock };
};
