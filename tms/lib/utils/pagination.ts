// Pagination utilities for efficient data loading
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export function getPaginationParams(options: PaginationOptions = {}) {
  const page = options.page || 1;
  const pageSize = options.pageSize || 20;
  const limit = options.limit || pageSize;
  const offset = options.offset !== undefined ? options.offset : (page - 1) * pageSize;
  
  return { limit, offset, page, pageSize };
}

export function createPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  return {
    data,
    total,
    page,
    pageSize,
    hasMore: (page * pageSize) < total,
  };
}

// Lazy loading helper - fetch data when needed
export class LazyDataLoader<T> {
  private cache: Map<string, T[]> = new Map();
  private loading: Set<string> = new Set();
  private fetcher: (key: string, options?: PaginationOptions) => Promise<PaginatedResult<T>>;

  constructor(
    fetcher: (key: string, options?: PaginationOptions) => Promise<PaginatedResult<T>>
  ) {
    this.fetcher = fetcher;
  }

  async load(key: string, options?: PaginationOptions): Promise<PaginatedResult<T>> {
    const cacheKey = `${key}-${JSON.stringify(options || {})}`;
    
    // Return cached if available
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return {
        data: cached,
        total: cached.length,
        page: options?.page || 1,
        pageSize: options?.pageSize || 20,
        hasMore: false,
      };
    }

    // Prevent duplicate requests
    if (this.loading.has(cacheKey)) {
      // Wait for existing request
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.load(key, options);
    }

    this.loading.add(cacheKey);
    try {
      const result = await this.fetcher(key, options);
      this.cache.set(cacheKey, result.data);
      return result;
    } finally {
      this.loading.delete(cacheKey);
    }
  }

  invalidate(key?: string) {
    if (key) {
      const keysToDelete = Array.from(this.cache.keys()).filter(k => k.startsWith(key));
      keysToDelete.forEach(k => this.cache.delete(k));
    } else {
      this.cache.clear();
    }
  }
}


