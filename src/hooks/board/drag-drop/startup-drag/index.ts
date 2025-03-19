
import { useState } from 'react';
import { useDropHandler } from './use-drop-handler';
import { createDragEventHandlers } from './event-handlers';
import { StartupDragState } from './types';
import { UseBoardDragDropParams } from '../types';

/**
 * Main hook for handling startup drag and drop operations
 * This refactored version delegates to smaller, focused hooks and utilities
 */
export function useStartupDrag({
  columns,
  setColumns,
  statuses,
  getStartupById,
  queryClient
}: UseBoardDragDropParams): StartupDragState {
  const [draggingStartupId, setDraggingStartupId] = useState<string | null>(null);
  
  // Get drag event handlers
  const { handleDragStart, handleDragOver, handleDragEnd } = createDragEventHandlers(setDraggingStartupId);
  
  // Get drop handler
  const { handleDrop } = useDropHandler({
    columns,
    setColumns,
    statuses,
    getStartupById,
    queryClient,
    draggingStartupId,
    setDraggingStartupId
  });

  return {
    draggingStartupId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
}

export * from './types';
export * from './validation';
export * from './data-extraction';
export * from './ui-update';
export * from './event-handlers';
export * from './use-drop-handler';
