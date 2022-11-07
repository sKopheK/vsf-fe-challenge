import { DEFAULT_EXPIRATION } from './Storage.constants';
import { StoredData } from './Storage.types';

class StorageService {
  public set(key: string, value: string, expiration?: number) {
    localStorage.setItem(
      key,
      JSON.stringify({
        data: value,
        expiration: Date.now() + (expiration ?? DEFAULT_EXPIRATION),
      } as StoredData)
    );
  }
  public get(key: string) {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return null;
    }
    try {
      const parsed: StoredData = JSON.parse(stored);
      if (parsed.expiration - Date.now() > 0) {
        return parsed.data;
      }
    } catch {}
    return null;
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
