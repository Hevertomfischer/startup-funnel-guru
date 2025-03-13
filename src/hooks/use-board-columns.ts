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
  
  // Pre-fetch all startup data by status outside of the reducer
  const statusIds = useMemo(() => statuses.map(status => status.id), [statuses]);
  
  // Get startup data for each column
  const getStartupById = (id: string): any | undefined => {
    // We'll implement this in a way that doesn't cause hook rules violations
    return undefined; // Placeholder, will be updated
  };

  return {
    columns,
    setColumns,
    statusIds,
    statuses,
    isLoadingStatuses,
    isErrorStatuses,
    getStartupById
  };
}
