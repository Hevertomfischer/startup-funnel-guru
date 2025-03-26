
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
  searchTerm?: string;
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
  const [filteredStartups, setFilteredStartups] = useState(startups);
  const [displayCount, setDisplayCount] = useState(safeStartupIds.length);
  
  // Update filtered startups when the search term or startups change
  useEffect(() => {
    if (searchTerm) {
      const filtered = startups.filter(startup => 
        startup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.ceo_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.sector?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStartups(filtered);
      setDisplayCount(filtered.length);
    } else {
      setFilteredStartups(startups);
      setDisplayCount(safeStartupIds.length);
    }
  }, [searchTerm, startups, safeStartupIds]);
  
  // Log columns info for debugging
  useEffect(() => {
    console.log(`Column ${id} (${title}) - startupIds: ${safeStartupIds.length}, startups: ${startups.length}, filteredStartups: ${filteredStartups.length}, displayCount: ${displayCount}`);
  }, [id, title, safeStartupIds.length, startups.length, filteredStartups.length, displayCount]);

  return (
    <div 
      className="flex flex-col h-full bg-accent/50 backdrop-blur-sm rounded-xl min-w-[280px] w-[280px] shadow-sm border"
      onDragOver={onDragOver}
      onDrop={(e) => {
        console.log('BoardColumn onDrop event triggered for column:', id);
        onDrop(e, id);
      }}
      data-column-id={id}
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
        startups={filteredStartups}
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
