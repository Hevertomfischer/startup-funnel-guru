
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUpdateStartupMutation } from '../use-supabase-query';
import { Column } from '@/types';

export function useBoardDragDrop(
  columns: Column[],
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
  statuses: any[],
  getStartupById: (id: string) => any | undefined
) {
  const { toast } = useToast();
  const [draggingStartupId, setDraggingStartupId] = useState<string | null>(null);
  
  // Mutations for updating startups
  const updateStartupMutation = useUpdateStartupMutation();
  
  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, startupId: string) => {
    e.dataTransfer.setData('text/plain', startupId);
    e.dataTransfer.setData('type', 'startup');
    setDraggingStartupId(startupId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    
    // Check if this is a startup being dragged
    const type = e.dataTransfer.getData('type');
    if (type !== 'startup') return;
    
    const startupId = e.dataTransfer.getData('text/plain');
    const startup = getStartupById(startupId);
    
    if (startup && startup.status_id !== columnId) {
      // Update the startup's status in Supabase
      updateStartupMutation.mutate({
        id: startupId,
        startup: { status_id: columnId }
      });
      
      // Create a new columns array with the updated startupIds
      const newColumns = columns.map(col => ({
        ...col,
        startupIds: col.id === columnId 
          ? [...col.startupIds, startupId] 
          : col.startupIds.filter(id => id !== startupId)
      }));
      
      // Important: preserve the original column order
      setColumns(newColumns);
      
      const newStatus = statuses.find(s => s.id === columnId);
      toast({
        title: "Startup moved",
        description: `Startup moved to ${newStatus?.name || 'new status'}`,
      });
    }
    
    setDraggingStartupId(null);
  };
  
  const handleDragEnd = () => {
    setDraggingStartupId(null);
  };

  return {
    draggingStartupId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
}
