// Optimized retry logic with visibility API and fast retry path
export interface RetryConfig {
  fastRetryDelay?: number; // Fast path retry (e.g., 300ms)
  maxRetries?: number;
  retryDelays?: number[]; // Custom retry delays
  checkVisibility?: boolean; // Abort if tab is hidden
}

const DEFAULT_CONFIG: Required<Omit<RetryConfig, 'retryDelays'>> & { retryDelays: number[] } = {
  fastRetryDelay: 300,
  maxRetries: 3,
  retryDelays: [1000, 2000, 4000],
  checkVisibility: true,
};

export async function visibilityAwareRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const opts = { ...DEFAULT_CONFIG, ...config };
  let lastError: any;

  // Fast retry path - try once quickly
  try {
    return await Promise.race([
      fn(),
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Fast retry timeout')), opts.fastRetryDelay)
      )
    ]);
  } catch (error) {
    lastError = error;
    // If fast retry fails, continue to normal retries
  }

  // Check visibility before proceeding
  if (opts.checkVisibility && typeof document !== 'undefined') {
    if (document.hidden) {
      throw new Error('Tab is hidden, aborting retry');
    }
  }

  // Normal retry path with exponential backoff
  for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
    // Check visibility before each retry
    if (opts.checkVisibility && typeof document !== 'undefined') {
      if (document.hidden) {
        throw new Error('Tab became hidden during retry');
      }
    }

    try {
      const delay = opts.retryDelays[Math.min(attempt, opts.retryDelays.length - 1)];
      await new Promise(resolve => setTimeout(resolve, delay));
      return await fn();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

// Watchdog with visibility awareness
export function createVisibilityAwareWatchdog(
  checkFn: () => Promise<boolean>,
  onSuccess: () => void,
  config: RetryConfig = {}
) {
  const opts = { ...DEFAULT_CONFIG, ...config };
  let cancelled = false;
  let timeoutId: NodeJS.Timeout | null = null;

  const schedule = (attempt: number = 0) => {
    if (cancelled) return;
    
    // Check visibility
    if (opts.checkVisibility && typeof document !== 'undefined' && document.hidden) {
      return; // Don't schedule if tab is hidden
    }

    const delay = attempt === 0 
      ? opts.fastRetryDelay 
      : opts.retryDelays[Math.min(attempt - 1, opts.retryDelays.length - 1)];

    timeoutId = setTimeout(async () => {
      if (cancelled) return;
      
      // Check visibility again before executing
      if (opts.checkVisibility && typeof document !== 'undefined' && document.hidden) {
        return;
      }

      try {
        const success = await checkFn();
        if (success) {
          onSuccess();
          return;
        }
      } catch (error) {
        // Continue retrying on error
      }

      if (!cancelled && attempt < opts.maxRetries) {
        schedule(attempt + 1);
      }
    }, delay);
  };

  schedule();

  return {
    cancel: () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    },
  };
}


