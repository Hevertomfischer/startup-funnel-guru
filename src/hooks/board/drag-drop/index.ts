
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

// Export types but avoid re-exporting the conflicting StartupDragState
export * from './types';

// Export everything from startup-drag except what's already exported
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
