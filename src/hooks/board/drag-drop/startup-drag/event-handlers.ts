
import { StartupDragEvents } from './types';

/**
 * Creates event handlers for drag and drop events
 */
export const createDragEventHandlers = (
  setDraggingStartupId: (id: string | null) => void
): StartupDragEvents => {
  const handleDragStart = (e: React.DragEvent, startupId: string) => {
    e.dataTransfer.setData('text/plain', startupId);
    e.dataTransfer.setData('type', 'startup');
    setDraggingStartupId(startupId);
    
    // Store source column for tracking
    const sourceColumn = e.currentTarget.closest('[data-column-id]');
    if (sourceColumn) {
      const sourceColumnId = sourceColumn.getAttribute('data-column-id');
      if (sourceColumnId) {
        e.dataTransfer.setData('sourceColumnId', sourceColumnId);
        console.log(`Dragging startup ${startupId} from column ${sourceColumnId}`);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDragEnd = () => {
    setDraggingStartupId(null);
  };
  
  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
};
