
import { useStartupDrag } from './startup-drag';
import { useColumnDrag } from './use-column-drag';
import { UseBoardDragDropParams } from './types';

export function useBoardDragDrop(params: UseBoardDragDropParams) {
  const startupDrag = useStartupDrag(params);
  const columnDrag = useColumnDrag(params);
  
  return {
    ...startupDrag,
    ...columnDrag
  };
}

// Only export the specific types from the main types file using 'export type'
export type { 
  UseBoardDragDropParams, 
  ColumnDragState 
} from './types';

// Export the StartupDragState type from startup-drag/types to avoid conflict
export type { StartupDragState } from './startup-drag/types';

// Export everything from startup-drag except the types that are already exported
export { 
  useStartupDrag,
  validateDragDropParams,
  sanitizeId,
  getSourceColumnId,
  validateTargetColumn,
  prepareMutationPayload,
  updateColumnsOptimistically,
  createDragEventHandlers,
  useDropHandler
} from './startup-drag';

export * from './use-column-drag';
