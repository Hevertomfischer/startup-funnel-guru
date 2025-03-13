
import { useState, useEffect, useMemo } from 'react';
import { Column } from '@/types';
import { useStatusesQuery } from './use-supabase-query';

export function useBoardColumns() {
  // Fetch statuses from Supabase
  const { 
    data: statuses = [], 
    isLoading: isLoadingStatuses,
    isError: isErrorStatuses
  } = useStatusesQuery();
  
  // Create columns based on statuses
  const [columns, setColumns] = useState<Column[]>([]);
  
  // Update columns when statuses are loaded
  useEffect(() => {
    if (statuses.length > 0) {
      const newColumns = statuses.map(status => ({
        id: status.id,
        title: status.name,
        startupIds: []
      }));
      setColumns(newColumns);
    }
  }, [statuses]);
  
  // Get status IDs for queries
  const statusIds = useMemo(() => 
    statuses.map(status => status.id),
    [statuses]
  );
  
  return {
    columns,
    setColumns,
    statusIds,
    statuses,
    isLoadingStatuses,
    isErrorStatuses
  };
}
