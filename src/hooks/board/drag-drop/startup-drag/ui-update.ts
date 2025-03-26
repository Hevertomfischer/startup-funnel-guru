
import { Column } from '@/types';

/**
 * Updates columns optimistically before the API call completes
 */
export const updateColumnsOptimistically = (
  columns: Column[],
  startupId: string,
  targetColumnId: string
): Column[] => {
  console.log('Updating columns optimistically:', {
    columns: columns.length,
    startupId,
    targetColumnId
  });
  
  // First log the current state of columns for debugging
  columns.forEach(col => {
    console.log(`Column ${col.id}: ${col.startupIds.length} startups`);
  });
  
  // Create a new array of columns
  const updatedColumns = columns.map(col => {
    if (col.id === targetColumnId) {
      // Add the startup to the target column if it's not already there
      if (!col.startupIds.includes(startupId)) {
        console.log(`Adding startup ${startupId} to column ${col.id}`);
        return {
          ...col,
          startupIds: [...col.startupIds, startupId]
        };
      }
      return col;
    } else {
      // Remove the startup from any other column
      if (col.startupIds.includes(startupId)) {
        console.log(`Removing startup ${startupId} from column ${col.id}`);
        return {
          ...col,
          startupIds: col.startupIds.filter(id => id !== startupId)
        };
      }
      return col;
    }
  });
  
  // Log the updated columns state
  updatedColumns.forEach(col => {
    console.log(`Updated column ${col.id}: ${col.startupIds.length} startups`);
  });
  
  return updatedColumns;
};
