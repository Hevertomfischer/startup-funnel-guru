
import React from 'react';
import { FileText, ListTodo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Startup } from '@/types';

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
      
      {hasPitchDeck && (
        <Badge 
          className="bg-amber-500/80 text-white cursor-pointer" 
          title="View Pitch Deck"
          onClick={onPitchDeckClick}
        >
          <FileText className="h-3 w-3 mr-1" />
          Deck
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
