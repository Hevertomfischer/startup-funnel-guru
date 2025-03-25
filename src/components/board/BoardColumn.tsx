
import React from 'react';
import { Startup } from '@/types';
import { 
  ColumnHeader, 
  ColumnContent
} from '@/components/board/column';

interface BoardColumnProps {
  id: string;
  title: string;
  color: string;
  startups: any[];
  startupIds: string[];
  isLoading: boolean;
  isError: boolean;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, startupId: string) => void;
  onDragEnd: () => void;
  draggingStartupId: string | null;
  onAddStartup: (statusId: string) => void;
  isPendingAdd: boolean;
  pendingAddStatusId: string | null;
  onCardClick: (startup: any) => void;
  onDeleteStartup?: (startupId: string) => void;
  showCompactCards: boolean;
  statuses: any[];
  users: any;
  onEditColumn?: () => void;
  onCreateTask: (startup: any) => void;
  searchTerm?: string; // Add the searchTerm prop
}

const BoardColumn: React.FC<BoardColumnProps> = ({
  id,
  title,
  color,
  startups,
  startupIds,
  isLoading,
  isError,
  onDrop,
  onDragOver,
  onDragStart,
  onDragEnd,
  draggingStartupId,
  onAddStartup,
  isPendingAdd,
  pendingAddStatusId,
  onCardClick,
  onDeleteStartup,
  showCompactCards,
  statuses,
  users,
  onEditColumn,
  onCreateTask,
  searchTerm = '' // Add default value
}) => {
  // Ensure startupIds is an array and not null
  const safeStartupIds = Array.isArray(startupIds) ? startupIds : [];

  return (
    <div 
      className="flex flex-col h-full bg-accent/50 backdrop-blur-sm rounded-xl min-w-[280px] w-[280px] shadow-sm border"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
      data-column-id={id} // Add data attribute for column ID
    >
      <ColumnHeader 
        title={title}
        color={color}
        count={safeStartupIds.length || 0}
        onEditColumn={onEditColumn}
        onAddStartup={onAddStartup}
        id={id}
        isPendingAdd={isPendingAdd}
        pendingAddStatusId={pendingAddStatusId}
      />
      
      <ColumnContent 
        startups={startups}
        isLoading={isLoading}
        isError={isError}
        draggingStartupId={draggingStartupId}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onCardClick={onCardClick}
        onDeleteStartup={onDeleteStartup}
        showCompactCards={showCompactCards}
        statuses={statuses}
        users={users}
        onCreateTask={onCreateTask}
        searchTerm={searchTerm} // Pass the searchTerm prop to ColumnContent
      />
    </div>
  );
};

export default BoardColumn;
