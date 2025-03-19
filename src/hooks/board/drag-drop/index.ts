
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

export * from './types';
export * from './startup-drag';
export * from './use-column-drag';
