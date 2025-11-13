// Centralized error handling with retry logic
export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  retryable?: (error: any) => boolean;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  retryable: (error: any) => {
    // Retry on network errors or 5xx errors
    if (!error) return false;
    if (error.message?.includes('timeout') || error.message?.includes('network')) return true;
    if (error.status >= 500 && error.status < 600) return true;
    return false;
  }
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry if error is not retryable
      if (!opts.retryable(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === opts.maxRetries) {
        break;
      }

      // Exponential backoff
      const delay = opts.retryDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export function handleError(error: any, context?: string): string {
  const errorMessage = error?.message || error?.error?.message || 'An unexpected error occurred';
  const errorCode = error?.code || error?.error?.code;
  const statusCode = error?.status || error?.statusCode;
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'Error'}]`, error);
  }

  // Handle 404 NOT_FOUND errors specifically
  if (statusCode === 404 || errorCode === 'PGRST116' || errorCode === 'NOT_FOUND' || errorMessage.includes('NOT_FOUND')) {
    if (errorMessage.includes('rpc') || errorMessage.includes('function')) {
      return 'Database function not found. Please contact support.';
    }
    if (errorMessage.includes('table') || errorMessage.includes('relation')) {
      return 'Database table not found. Please contact support.';
    }
    if (errorMessage.includes('bucket') || errorMessage.includes('storage')) {
      return 'Storage bucket not found. Please contact support.';
    }
    return 'Resource not found. The requested item may have been removed or does not exist.';
  }

  // User-friendly error messages
  if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }
  if (errorMessage.includes('RLS') || errorMessage.includes('permission')) {
    return 'Permission denied. Please check your authentication.';
  }
  if (errorMessage.includes('foreign key')) {
    return 'Invalid reference. Please refresh the page.';
  }
  if (errorMessage.includes('unique constraint')) {
    return 'This record already exists.';
  }
  if (errorMessage.includes('not null')) {
    return 'Please fill in all required fields.';
  }

  return errorMessage;
}

