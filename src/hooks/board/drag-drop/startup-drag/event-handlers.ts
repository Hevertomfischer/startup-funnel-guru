
import { isValidUUID } from './validation';

/**
 * Creates event handlers for startup drag events
 */
export const createDragEventHandlers = (
  setDraggingStartupId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const handleDragStart = (e: React.DragEvent, startupId: string) => {
    console.log('Starting drag for startup:', startupId);
    
    // CRITICAL: Ensure we have a valid UUID for the startup
    if (!startupId || !isValidUUID(startupId)) {
      console.error('Invalid startup ID for drag:', startupId);
      e.preventDefault();
      return;
    }
    
    // Find the column element that contains this startup
    const columnElement = e.currentTarget.closest('[data-column-id]');
    const sourceColumnId = columnElement?.getAttribute('data-column-id') || '';
    
    console.log('Drag started from column:', sourceColumnId);
    
    // Set drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', startupId);
    e.dataTransfer.setData('type', 'startup');
    e.dataTransfer.setData('sourceColumnId', sourceColumnId);
    
    // Update UI state
    setDraggingStartupId(startupId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
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
