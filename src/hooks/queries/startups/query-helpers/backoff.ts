
/**
 * Implements exponential backoff for retrying failed queries
 * @param attempt Current attempt number
 * @returns Delay time in milliseconds
 */
export const getBackoffDelay = (attempt: number): number => {
  return Math.min(1000 * 2 ** attempt, 30000); // backoff exponencial limitado a 30 segundos
};
