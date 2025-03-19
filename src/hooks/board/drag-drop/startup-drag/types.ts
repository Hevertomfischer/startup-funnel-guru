
import { UseBoardDragDropParams } from '../types';

export interface StartupDragState {
  draggingStartupId: string | null;
  handleDragStart: (e: React.DragEvent, startupId: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, columnId: string) => void;
  handleDragEnd: () => void;
}

export interface StartupDragEvents {
  handleDragStart: (e: React.DragEvent, startupId: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragEnd: () => void;
}

export interface StartupDragHandlerParams extends UseBoardDragDropParams {
  draggingStartupId: string | null;
  setDraggingStartupId: (id: string | null) => void;
}
