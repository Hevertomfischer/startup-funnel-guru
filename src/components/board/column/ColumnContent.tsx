
import React from 'react';
import { StartupCard } from '@/components/startup-card';
import { EmptyColumnPlaceholder } from './EmptyColumnPlaceholder';
import { ErrorPlaceholder } from './ErrorPlaceholder';
import { LoadingPlaceholder } from './LoadingPlaceholder';
import { mapStartups } from './StartupMapper';

interface ColumnContentProps {
  startups: any[];
  isLoading: boolean;
  isError: boolean;
  draggingStartupId: string | null;
  onDragStart: (e: React.DragEvent, startupId: string) => void;
  onDragEnd: () => void;
  onCardClick: (startup: any) => void;
  onDeleteStartup?: (startupId: string) => void;
  showCompactCards: boolean;
  statuses: any[];
  users: any;
  onCreateTask: (startup: any) => void;
  searchTerm?: string; // Add searchTerm prop
}

export const ColumnContent: React.FC<ColumnContentProps> = ({
  startups,
  isLoading,
  isError,
  draggingStartupId,
  onDragStart,
  onDragEnd,
  onCardClick,
  onDeleteStartup,
  showCompactCards,
  statuses,
  users,
  onCreateTask,
  searchTerm = '' // Set default value
}) => {
  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  if (isError) {
    return <ErrorPlaceholder />;
  }

  if (!startups || startups.length === 0) {
    return <EmptyColumnPlaceholder />;
  }

  // Filter startups by search term if provided
  const filteredStartups = searchTerm
    ? startups.filter(startup => 
        startup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.ceo_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.sector?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : startups;

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-3 min-h-[50px]">
      {filteredStartups.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">
          Nenhum resultado encontrado
        </div>
      ) : (
        mapStartups(
          filteredStartups,
          draggingStartupId,
          onDragStart,
          onDragEnd,
          onCardClick,
          onDeleteStartup,
          showCompactCards,
          statuses,
          users,
          onCreateTask
        )
      )}
    </div>
  );
};
