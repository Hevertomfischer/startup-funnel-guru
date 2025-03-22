
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface BoardMeetingEmptyStateProps {
  onAddClick: () => void;
}

const BoardMeetingEmptyState: React.FC<BoardMeetingEmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>Nenhuma reunião registrada para esta startup</p>
      <Button variant="outline" className="mt-4" onClick={onAddClick}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Agendar Primeira Reunião
      </Button>
    </div>
  );
};

export default BoardMeetingEmptyState;
