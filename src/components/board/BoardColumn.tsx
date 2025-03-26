
import React, { useEffect, useState } from 'react';
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
  searchTerm = ''
}) => {
  // Ensure startupIds is an array and not null
  const safeStartupIds = Array.isArray(startupIds) ? startupIds : [];
  
  // Filtered startups based on search term
  const filteredStartups = searchTerm
    ? startups.filter(startup => 
        startup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.ceo_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.sector?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : startups;
    
  // Count of displayed startups based on filter or total
  const displayCount = searchTerm ? filteredStartups.length : safeStartupIds.length;
  
  // Log columns info for debugging
  useEffect(() => {
    console.log(`Column ${id} (${title}) - startupIds: ${safeStartupIds.length}, startups: ${startups.length}, filteredStartups: ${filteredStartups.length}`);
  }, [id, title, safeStartupIds, startups, filteredStartups]);

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
        count={displayCount}
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
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default BoardColumn;
