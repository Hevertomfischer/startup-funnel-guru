
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Startup } from '@/types';
import StartupCard from '@/components/startup-card';
import { cn } from '@/lib/utils';

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
  
  // Map startup data to the format expected by StartupCard
  const mapStartupToCardFormat = (startup: any): Startup => {
    // Check if the startup has a pitchdeck in attachments
    let pitchDeck;
    const attachments = startup.attachments || [];
    
    if (Array.isArray(attachments) && attachments.length > 0) {
      // Look for a pitch deck in the attachments
      pitchDeck = attachments.find(
        (att: any) => 
          att.isPitchDeck === true || 
          (att.name && (
            att.name.toLowerCase().includes('pitch') || 
            att.name.toLowerCase().includes('deck')
          ))
      );
    }
    
    // If the startup already has a pitch_deck property, use that
    if (startup.pitch_deck && startup.pitch_deck.url) {
      pitchDeck = startup.pitch_deck;
    }
    
    // Log what we found for debugging
    if (pitchDeck) {
      console.log(`Found pitch deck for startup ${startup.id}:`, pitchDeck);
    }
    
    return {
      id: startup.id,
      createdAt: startup.created_at ? startup.created_at : new Date().toISOString(),
      updatedAt: startup.updated_at ? startup.updated_at : new Date().toISOString(),
      statusId: startup.status_id || '',
      values: {
        Startup: startup.name,
        'Problema que Resolve': startup.problem_solved,
        Setor: startup.sector,
        'Modelo de Negócio': startup.business_model,
        'Site da Startup': startup.website,
        MRR: startup.mrr,
        'Quantidade de Clientes': startup.client_count,
        'Cidade': startup.city,
        'Estado': startup.state
      },
      labels: [],
      priority: startup.priority as 'low' | 'medium' | 'high',
      assignedTo: startup.assigned_to,
      dueDate: startup.due_date,
      timeTracking: startup.time_tracking,
      attachments: startup.attachments || [],
      pitchDeck: pitchDeck ? {
        name: pitchDeck.name || 'Pitch Deck',
        url: pitchDeck.url,
        size: pitchDeck.size || 0,
        type: pitchDeck.type || 'application/pdf',
        isPitchDeck: true
      } : undefined
    };
  };

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
