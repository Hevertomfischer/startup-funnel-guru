
import { useEffect } from 'react';

/**
 * Logs detailed information about statuses and columns for debugging
 */
export const useDebugLogging = (
  statuses: any[],
  columns: any[]
) => {
  useEffect(() => {
    console.log("useStatusQueries received:", { 
      statusesCount: statuses?.length || 0, 
      columnsCount: columns?.length || 0,
      statusesData: statuses?.map(s => ({id: s.id, name: s.name})) || [],
      columnsData: columns?.map(c => ({id: c.id, title: c.title})) || []
    });
  }, [statuses, columns]);
};
