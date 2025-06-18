export class LRUCache<K, V> {
  private cache = new Map<K, V>();

  constructor(private maxSize: number) {
    if (maxSize <= 0) {
      throw new Error('LRUCache: maxSize must be > 0');
    }
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value === undefined) {
      return undefined;
    }
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    else if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}
