
import { Column } from '@/types';

/**
 * Updates columns optimistically before the API call completes
 */
export const updateColumnsOptimistically = (
  columns: Column[],
  startupId: string,
  targetColumnId: string
): Column[] => {
  return columns.map(col => ({
    ...col,
    startupIds: col.id === targetColumnId 
      ? [...col.startupIds, startupId] 
      : col.startupIds.filter(id => id !== startupId)
  }));
};
