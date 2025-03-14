import { useState, useEffect, useMemo } from 'react';
import { Column } from '@/types';
import { useStatusesQuery } from '../use-supabase-query';
import { updateStatusPositions } from '@/services';
import { useToast } from '@/hooks/use-toast';

export function useBoardColumns() {
  const { toast } = useToast();
  
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
        startupIds: [],
        position: status.position
      }));
      setColumns(newColumns);
    }
  }, [statuses]);
  
  // Get status IDs for queries
  const statusIds = useMemo(() => 
    statuses.map(status => status.id),
    [statuses]
  );
  
  // Function to reorder columns
  const reorderColumns = async (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex === destinationIndex) return;
    
    // Create a new array of columns
    const newColumns = [...columns];
    const [removed] = newColumns.splice(sourceIndex, 1);
    newColumns.splice(destinationIndex, 0, removed);
    
    // Update positions based on new order
    const updatedColumns = newColumns.map((column, index) => ({
      ...column,
      position: index
    }));
    
    // Update the state first for immediate UI feedback
    setColumns(updatedColumns);
    
    // Create positions array for API update
    const statusPositions = updatedColumns.map(column => ({
      id: column.id,
      position: column.position
    }));
    
    // Update the database
    const success = await updateStatusPositions(statusPositions);
    
    if (success) {
      toast({
        title: "Column order updated",
        description: "The new column order has been saved"
      });
    } else {
      // If the update fails, revert to original state
      toast({
        title: "Failed to update column order",
        description: "There was an error saving the new column order",
        variant: "destructive"
      });
      // We don't revert the UI since the query will refresh
    }
  };
  
  return {
    columns,
    setColumns,
    statusIds,
    statuses,
    isLoadingStatuses,
    isErrorStatuses,
    reorderColumns
  };
}
