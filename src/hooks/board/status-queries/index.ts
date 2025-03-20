
import { useConnectionCheck } from './connection-check';
import { useStatusQueryHooks, useQueryResults } from './query-management';
import { useQueriesMapping } from './query-mapping';
import { useIsAnyQueryLoading, useIsAnyQueryError } from './status-conditions';
import { createStartupFinder } from './startup-finder';
import { useUpdateColumnsEffect } from './column-update';
import { useEmptyBoardNotice } from './empty-board-notice';
import { useDebugLogging } from './debug-logging';
import { useMemo } from 'react';

export function useStatusQueries({ statuses, columns }: { statuses: any[], columns: any[] }) {
  // Check direct connection to Supabase
  useConnectionCheck();
  
  // Log detailed information about statuses and columns for debugging
  useDebugLogging(statuses, columns);
  
  // Get all status IDs from the columns array
  const statusIds = useMemo(() => 
    columns.map(column => column.id),
    [columns]
  );

  // Create query hooks for each status
  const queryHooks = useStatusQueryHooks(statusIds);
  
  // Combine real queries into results array based on available statusIds
  const queryResults = useQueryResults(statusIds, queryHooks);
  
  // Map queries to their status IDs
  const queries = useQueriesMapping(queryResults);
  
  // Check if any real query is loading or has an error
  const isLoading = useIsAnyQueryLoading(statusIds, queries);
  const isError = useIsAnyQueryError(statusIds, queries);
  
  // Update columns with startup IDs from query data
  useUpdateColumnsEffect(columns, queries);

  // Create a function to get a startup by its ID from any of the queries
  const getStartupById = useMemo(() => 
    createStartupFinder(statusIds, queries),
    [statusIds, queries]
  );

  // Show a toast notification if there are no boards yet
  useEmptyBoardNotice(isLoading, columns.length, statuses.length);
  
  return { 
    queries, 
    isLoading, 
    isError,
    mappedQueries: queries, // Add mappedQueries alias for backward compatibility
    getStartupById 
  };
}
