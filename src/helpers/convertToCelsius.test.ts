import convertToCelsius from './convertToCelsius';

it('should correctly convert temperature F -> C', () => {
  expect(convertToCelsius(32)).toBe(0);
  expect(convertToCelsius(212)).toBe(100);
});
