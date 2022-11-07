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

export const clearWatchMock = jest.fn();
export const getCurrentPositionMock = jest.fn();
export const watchPositionMock = jest.fn();

export const mockNavigatorGeolocation = () => {
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
};
