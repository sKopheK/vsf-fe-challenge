import ApiService from './Api';

describe('Api Service', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('should return response', async () => {
    const mockedData = { test: true };
    fetchMock.mockResponse(JSON.stringify(mockedData));
    const apiService = new ApiService();
    const result = await apiService.get('https://www.google.com');
    expect(result).toStrictEqual(mockedData);
  });
});
