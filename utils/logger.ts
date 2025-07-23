/**
 * @file logger.ts
 * @description
 * Centralized logging utility to standardize logs across the app during development.
 */

/**
 * Logs an error message with optional error object in development mode.
 * 
 * @param context - A short label indicating where the error happened.
 * @param error - The error object or unknown value.
 */
export const logError = (context: string, error: unknown) => {
  if (__DEV__) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`🛑 [${context}] Error: ${message}`, error);
  }
};

/**
 * Logs general info/data during development.
 * 
 * @param context - A short label indicating what is being logged.
 * @param data - Optional additional data to display.
 */
export const logInfo = (context: string, data?: unknown) => {
  if (__DEV__) {
    console.log(`ℹ️ [${context}]`, data ?? "(no data)");
  }
};

/**
 * Logs success messages during development.
 * 
 * @param context - A short label indicating a successful operation.
 * @param data - Optional data associated with the success.
 */
export const logSuccess = (context: string, data?: unknown) => {
  if (__DEV__) {
    console.log(`✅ [${context}] Success`, data ?? "");
  }
};
