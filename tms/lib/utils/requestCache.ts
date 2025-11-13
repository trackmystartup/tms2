// Request deduplication and caching
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  promise?: Promise<T>;
}

class RequestCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly TTL = 30000; // 30 seconds default TTL
  private pendingRequests = new Map<string, Promise<any>>();

  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.TTL
  ): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);

    // Return cached data if still valid
    if (cached && (now - cached.timestamp) < ttl) {
      return cached.data;
    }

    // Deduplicate concurrent requests
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Create new request
    const promise = fetcher()
      .then(data => {
        this.cache.set(key, { data, timestamp: now });
        this.pendingRequests.delete(key);
        return data;
      })
      .catch(error => {
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  // Role-specific cache key generator
  generateRoleKey(role: string, userId: string, dataType: string, ...additional: string[]): string {
    const parts = [role, userId, dataType, ...additional].filter(Boolean);
    return parts.join('-');
  }

  invalidate(key?: string): void {
    if (key) {
      this.cache.delete(key);
      this.pendingRequests.delete(key);
    } else {
      this.cache.clear();
      this.pendingRequests.clear();
    }
  }

  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

export const requestCache = new RequestCache();

