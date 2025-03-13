
import React from 'react';
import { Loader2, Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Startup } from '@/types';
import StartupCard from '@/components/StartupCard';
import { cn } from '@/lib/utils';

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
  showCompactCards: boolean;
  statuses: any[];
  users: any;
  onEditColumn?: () => void;
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
  showCompactCards,
  statuses,
  users,
  onEditColumn
}) => {
  // Filter startups to only include those in this column
  const columnStartups = startups || [];
  
  // Map startup data to the format expected by StartupCard
  const mapStartupToCardFormat = (startup: any): Startup => ({
    id: startup.id,
    createdAt: startup.created_at ? new Date(startup.created_at) : new Date(),
    updatedAt: startup.updated_at ? new Date(startup.updated_at) : new Date(),
    statusId: startup.status_id || '',
    values: {
      Startup: startup.name,
      'Problema que Resolve': startup.problem_solved,
      Setor: startup.sector,
      'Modelo de Negócio': startup.business_model,
      'Site da Startup': startup.website,
      MRR: startup.mrr,
      'Quantidade de Clientes': startup.client_count
    },
    labels: [],
    priority: startup.priority as 'low' | 'medium' | 'high',
    assignedTo: startup.assigned_to,
    dueDate: startup.due_date ? new Date(startup.due_date) : undefined,
    timeTracking: startup.time_tracking,
    attachments: []
  });

  return (
    <div 
      className="flex flex-col h-full bg-accent/50 backdrop-blur-sm rounded-xl min-w-[280px] w-[280px] shadow-sm border"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
    >
      <div 
        className="p-3 flex items-center justify-between"
        style={{ 
          borderBottom: `1px solid ${color}40` 
        }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="h-3 w-3 rounded-full" 
            style={{ backgroundColor: color || '#e2e8f0' }}
          />
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center justify-center rounded-full bg-muted w-6 h-6 text-xs font-medium">
            {startupIds?.length || 0}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onEditColumn && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={onEditColumn}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={() => onAddStartup(id)}
            disabled={isPendingAdd}
          >
            {isPendingAdd && id === pendingAddStatusId ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div 
        className="flex-1 p-2 overflow-y-auto space-y-3"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: `${color}20 transparent`
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
        
        {!isLoading && !isError && startupIds && startupIds.length > 0 && startupIds.map(startupId => {
          const startup = columnStartups.find((s: any) => s.id === startupId);
          
          if (!startup) return null;
          
          const cardStartup = mapStartupToCardFormat(startup);
          
          return (
            <div
              key={startupId}
              draggable
              onDragStart={(e) => onDragStart(e, startupId)}
              onDragEnd={onDragEnd}
              className={cn(
                "transition-opacity duration-200",
                draggingStartupId === startupId ? "opacity-50" : "opacity-100"
              )}
            >
              <StartupCard 
                startup={cardStartup} 
                statuses={statuses} 
                users={users}
                onClick={() => onCardClick(startup)}
                compact={showCompactCards}
              />
            </div>
          );
        })}
        
        {!isLoading && !isError && (!startupIds || startupIds.length === 0) && (
          <div className="h-20 flex items-center justify-center border border-dashed rounded-md text-muted-foreground text-sm">
            Drop startups here
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardColumn;
