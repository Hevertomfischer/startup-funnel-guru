
import React from 'react';
import { FileText, ListTodo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Startup } from '@/types/startup';

interface CardBadgesProps {
  openTasksCount: number;
  hasPitchDeck: boolean;
  startup: Startup;
  priorityColors: Record<string, string>;
  onTaskIconClick: (e: React.MouseEvent) => void;
  onPitchDeckClick: (e: React.MouseEvent) => void;
}

export const CardBadges: React.FC<CardBadgesProps> = ({
  openTasksCount,
  hasPitchDeck,
  startup,
  priorityColors,
  onTaskIconClick,
  onPitchDeckClick
}) => {
  // Check if pitch deck exists and has a URL (most reliable check)
  const pitchDeckAvailable = Boolean(startup.pitchDeck?.url);
  
  // Check if the startup has any attachments that are pitch decks
  const hasPitchDeckAttachment = startup.attachments?.some(attachment => 
    attachment.isPitchDeck === true || 
    attachment.is_pitch_deck === true ||
    (attachment.name && (
      attachment.name.toLowerCase().includes('pitch') || 
      attachment.name.toLowerCase().includes('deck')
    ))
  );
  
  // Determine if we should show the pitch deck badge - any of these conditions should trigger it
  const showPitchDeckBadge = pitchDeckAvailable || hasPitchDeckAttachment || hasPitchDeck;
  
  console.log("Card badges for startup:", startup.id, {
    pitchDeckAvailable, 
    hasPitchDeckAttachment,
    hasPitchDeck,
    showPitchDeckBadge
  });
  
  return (
    <div className="flex items-center gap-1">
      {openTasksCount > 0 ? (
        <Badge 
          className="bg-primary text-primary-foreground cursor-pointer" 
          title="Open tasks - Click to add new task"
          onClick={onTaskIconClick}
        >
          <ListTodo className="h-3 w-3 mr-1" />
          {openTasksCount}
        </Badge>
      ) : (
        <Badge 
          className="bg-primary/80 text-primary-foreground cursor-pointer" 
          title="Add new task"
          onClick={onTaskIconClick}
        >
          <ListTodo className="h-3 w-3 mr-1" />
          0
        </Badge>
      )}
      
      {showPitchDeckBadge && (
        <Badge 
          className="bg-amber-500/80 text-white cursor-pointer flex items-center" 
          title="View Pitch Deck"
          onClick={onPitchDeckClick}
        >
          <FileText className="h-3 w-3 mr-1" />
          <span className="mr-1">Deck</span>
          <span className="h-3.5 w-3.5 inline-flex items-center justify-center bg-amber-500 text-white rounded-sm">
            <FileText className="h-2 w-2" />
          </span>
        </Badge>
      )}
      
      <Badge 
        variant="outline" 
        className={`${priorityColors[startup.priority]} text-xs`}
      >
        {startup.priority.charAt(0).toUpperCase() + startup.priority.slice(1)}
      </Badge>
    </div>
  );
};
