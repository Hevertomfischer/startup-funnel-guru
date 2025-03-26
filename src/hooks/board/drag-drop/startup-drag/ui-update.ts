
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
  
  // Create a deep copy to prevent reference issues
  const updatedColumns = JSON.parse(JSON.stringify(columns));
  
  // First, remove the startup from any column it might be in
  for (let i = 0; i < updatedColumns.length; i++) {
    const oldColumnIndex = updatedColumns[i].startupIds.indexOf(startupId);
    if (oldColumnIndex !== -1) {
      console.log(`Removing startup ${startupId} from column ${updatedColumns[i].id}`);
      updatedColumns[i].startupIds.splice(oldColumnIndex, 1);
    }
  }
  
  // Then add it to the target column
  const targetColumn = updatedColumns.find(col => col.id === targetColumnId);
  if (targetColumn) {
    console.log(`Adding startup ${startupId} to column ${targetColumnId}`);
    if (!targetColumn.startupIds.includes(startupId)) {
      targetColumn.startupIds.push(startupId);
    }
  } else {
    console.error(`Target column ${targetColumnId} not found`);
  }
  
  // Log the updated columns state
  updatedColumns.forEach(col => {
    console.log(`Updated column ${col.id}: ${col.startupIds.length} startups`);
  });
  
  return updatedColumns;
};
