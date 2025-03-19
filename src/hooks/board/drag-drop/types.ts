
import { Column, Startup } from '@/types';
import { UseQueryResult } from '@tanstack/react-query';

export interface UseBoardDragDropParams {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  queryClient: any;
  statuses: any[];
  getStartupById: (id: string) => any | undefined;
}

export interface StartupDragState {
  draggingStartupId: string | null;
  handleDragStart: (e: React.DragEvent, startupId: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, columnId: string) => void;
  handleDragEnd: () => void;
}

export interface ColumnDragState {
  draggingColumnId: string | null;
  handleColumnDragStart: (e: React.DragEvent, columnId: string) => void;
  handleColumnDragOver: (e: React.DragEvent) => void;
  handleColumnDrop: (e: React.DragEvent, targetColumnId: string) => void;
}
