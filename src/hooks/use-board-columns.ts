
import { useState, useEffect, useMemo } from 'react';
import { Column } from '@/types';
import { useStatusesQuery } from './use-supabase-query';
import { useStartupsByStatus } from './use-startups-by-status';

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
  
  // Create an object to store our query results per column
  const columnQueries = useMemo(() => {
    return columns.reduce<Record<string, any>>((acc, column) => {
      const { data, isLoading, isError } = useStartupsByStatus(column.id);
      acc[column.id] = { data, isLoading, isError };
      return acc;
    }, {});
  }, [columns]);
  
  // Update column startupIds when startups are loaded
  useEffect(() => {
    if (columns.length > 0 && Object.keys(columnQueries).length > 0) {
      const newColumns = [...columns];
      
      columns.forEach((column, index) => {
        const query = columnQueries[column.id];
        if (query?.data) {
          newColumns[index].startupIds = query.data.map((startup: any) => startup.id);
        }
      });
      
      setColumns(newColumns);
    }
  }, [columns, columnQueries]);

  // Get a startup by ID from any status
  const getStartupById = (id: string): any | undefined => {
    for (const columnId in columnQueries) {
      const query = columnQueries[columnId];
      const startup = query?.data?.find((s: any) => s.id === id);
      if (startup) return startup;
    }
    return undefined;
  };

  return {
    columns,
    setColumns,
    columnQueries,
    statuses,
    isLoadingStatuses,
    isErrorStatuses,
    getStartupById
  };
}
