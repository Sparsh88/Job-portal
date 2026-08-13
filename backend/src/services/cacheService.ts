interface CacheItem<T> {
  data: T;
  expiry: number;
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTTL: number = 60 * 1000; // 60 seconds default TTL

  /**
   * Retrieve item from cache if not expired
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Set item in cache with TTL
   */
  set<T>(key: string, data: T, ttlMs: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
    });
  }

  /**
   * Delete specific cache key
   */
  del(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate keys matching a prefix or regex pattern
   */
  delPattern(pattern: string | RegExp): void {
    const isRegex = pattern instanceof RegExp;
    for (const key of this.cache.keys()) {
      if (isRegex ? pattern.test(key) : key.startsWith(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Specific helper to invalidate all job listing/detail caches
   */
  invalidateJobsCache(): void {
    this.delPattern('jobs:');
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }
}

export const memoryCache = new CacheService();
