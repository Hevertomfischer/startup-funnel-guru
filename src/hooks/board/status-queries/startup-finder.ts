
/**
 * Creates a function to find startups by ID across all status columns
 */
export const createStartupFinder = (
  statusIds: string[],
  queries: Record<string, { data: any[] }>
) => {
  /**
   * Gets a startup by its ID from any of the queries
   */
  return (id: string) => {
    // Check all status queries
    for (const statusId of statusIds) {
      if (!id || statusId.startsWith('placeholder-')) continue;
      const query = queries[statusId];
      if (!query || !query.data) continue;
      
      // Find startup in the data array
      const startup = query.data.find((s: any) => s.id === id);
      if (startup) return startup;
    }
    return undefined;
  };
};
