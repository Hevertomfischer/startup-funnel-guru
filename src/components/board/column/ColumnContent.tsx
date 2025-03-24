
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Startup } from '@/types';
import StartupCard from '@/components/startup-card';
import { cn } from '@/lib/utils';
import { mapStartupToCardFormat } from './StartupMapper';

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
}

const ColumnContent: React.FC<ColumnContentProps> = ({
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
  onCreateTask
}) => {
  // Ensure startups is an array and not null
  const safeStartups = Array.isArray(startups) ? startups : [];

  return (
    <div 
      className="flex-1 p-2 overflow-y-auto space-y-3"
      style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: `#e2e8f020 transparent`
      }}
    >
      {isLoading && (
        <div className="h-20 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {isError && (
        <div className="h-20 flex items-center justify-center text-destructive text-sm">
          Failed to load startups
        </div>
      )}
      
      {!isLoading && !isError && safeStartups.length > 0 && safeStartups.map(startup => {
        if (!startup) return null;
        
        const cardStartup = mapStartupToCardFormat(startup);
        
        return (
          <div
            key={startup.id}
            draggable
            onDragStart={(e) => onDragStart(e, startup.id)}
            onDragEnd={onDragEnd}
            className={cn(
              "transition-opacity duration-200",
              draggingStartupId === startup.id ? "opacity-50" : "opacity-100"
            )}
          >
            <StartupCard 
              startup={cardStartup} 
              statuses={statuses} 
              users={users}
              onClick={() => onCardClick(startup)}
              onDelete={onDeleteStartup}
              compact={showCompactCards}
              onCreateTask={() => onCreateTask(startup)}
            />
          </div>
        );
      })}
      
      {!isLoading && !isError && safeStartups.length === 0 && (
        <div className="h-20 flex items-center justify-center border border-dashed rounded-md text-muted-foreground text-sm">
          Drop startups here
        </div>
      )}
    </div>
  );
};

export default ColumnContent;
