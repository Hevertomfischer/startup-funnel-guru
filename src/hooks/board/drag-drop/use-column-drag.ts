
import { useState } from 'react';
import { ColumnDragState, UseBoardDragDropParams } from './types';

export function useColumnDrag({
  columns,
  setColumns
}: UseBoardDragDropParams): ColumnDragState {
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);

  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
    e.dataTransfer.setData('text/plain', columnId);
    e.dataTransfer.setData('type', 'column');
    setDraggingColumnId(columnId);
  };
  
  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    const type = e.dataTransfer.getData('type');
    if (type !== 'column') return;
    
    const sourceColumnId = e.dataTransfer.getData('text/plain');
    
    if (sourceColumnId !== targetColumnId) {
      const sourceIndex = columns.findIndex(col => col.id === sourceColumnId);
      const targetIndex = columns.findIndex(col => col.id === targetColumnId);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        const newColumns = [...columns];
        const [movedColumn] = newColumns.splice(sourceIndex, 1);
        newColumns.splice(targetIndex, 0, movedColumn);
        
        const columnsWithNewPositions = newColumns.map((col, index) => ({
          ...col,
          position: index
        }));
        
        setColumns(columnsWithNewPositions);
      }
    }
    
    setDraggingColumnId(null);
  };

  return {
    draggingColumnId,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop
  };
}
