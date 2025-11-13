// Utility to lock chosen console methods (log/info/debug/warn/etc.)
// By default, disables log/info/debug/warn while keeping errors visible.
// Usage: lockConsole();

const NOOP = () => {};

const DEFAULT_METHODS: Array<keyof Console> = ['log', 'info', 'debug', 'warn'];

type ConsoleMethod = keyof Console;

export const lockConsole = (methods: ConsoleMethod[] = DEFAULT_METHODS) => {
  if (typeof console === 'undefined') {
    return;
  }

  methods.forEach(method => {
    if (method in console) {
      try {
        (console as Record<ConsoleMethod, any>)[method] = NOOP;
      } catch {
        // Ignore reassignment errors in strict environments
      }
    }
  });
};

export const clearConsole = () => {
  if (typeof console !== 'undefined' && typeof console.clear === 'function') {
    try {
      console.clear();
    } catch {
      // Ignore environments where console.clear is restricted
    }
  }
};
