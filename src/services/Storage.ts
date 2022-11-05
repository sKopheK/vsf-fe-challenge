class StorageService {
  public set(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  public get(key: string) {
    return localStorage.getItem(key);
  }
  public clear(key?: string) {
    if (key === undefined) {
      localStorage.clear();
    } else {
      localStorage.removeItem(key);
    }
  }
}

export default StorageService;
