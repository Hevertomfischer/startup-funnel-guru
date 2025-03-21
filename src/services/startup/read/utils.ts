
/**
 * Aplica um atraso exponencial baseado no número da tentativa
 * @param attempt Número da tentativa atual
 * @returns Uma promise que resolve após o atraso
 */
export const applyExponentialBackoff = async (attempt: number): Promise<void> => {
  const delay = 500 * Math.pow(2, attempt);
  await new Promise(resolve => setTimeout(resolve, delay));
};
