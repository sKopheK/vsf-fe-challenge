import StorageService from './Storage';

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should store value', () => {
    const service = new StorageService();
    expect(() => service.set('random', 'test')).not.toThrow();
  });

  it('should return undefined when getting value from nonexisting key', () => {
    const service = new StorageService();
    expect(service.get('random')).toBeNull();
  });

  it('should return stored value', () => {
    const service = new StorageService();
    const key = 'random';
    const value = 'anything';
    service.set(key, value);
    expect(service.get(key)).toBe(value);
  });

  it('should return null for expired value', () => {
    const service = new StorageService();
    const key = 'key1';
    service.set(key, 'a value', -1);
    expect(service.get(key)).toBeNull();
  });

  it('should clear stored value', () => {
    const service = new StorageService();
    const key = 'something';
    service.set(key, 'nothing');
    service.clear(key);
    expect(service.get(key)).toBeNull();
  });

  it('should clear whole storage', () => {
    const service = new StorageService();
    const key1 = 'key1';
    const key2 = 'key2';
    service.set(key1, 'nothing');
    service.set(key2, 'nothing');
    service.clear();
    expect(service.get(key1)).toBeNull();
    expect(service.get(key2)).toBeNull();
  });
});
