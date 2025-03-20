
import { useEffect } from 'react';

/**
 * Updates columns with startup IDs from query data
 */
export const useUpdateColumnsEffect = (
  columns: any[],
  queries: Record<string, { data: any[] }>
) => {
  useEffect(() => {
    if (columns.length > 0) {
      // Only update if we have columns and data
      const updatedColumns = columns.map(column => {
        const query = queries[column.id];
        if (query && query.data) {
          // Extract IDs from the query data
          const startupIds = query.data.map((startup: any) => startup.id);
          return {
            ...column,
            startupIds: startupIds
          };
        }
        return column;
      });

      // Update columns with startupIds
      if (updatedColumns.some((col, i) => 
          col.startupIds?.length !== columns[i].startupIds?.length)) {
        console.log('Updating columns with startupIds', 
          { 
            updatedColumns: updatedColumns.map(c => ({ 
              id: c.id, 
              startupIds: c.startupIds?.length 
            })),
            originals: columns.map(c => ({ 
              id: c.id, 
              startupIds: c.startupIds?.length 
            }))
          }
        );
      }
    }
  }, [columns, queries]);
};
