
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { PitchDeckFile } from '../hooks/use-pitch-deck';

interface PitchDeckDisplayProps {
  pitchDeck: PitchDeckFile;
  onRemove: () => void;
}

export const PitchDeckDisplay: React.FC<PitchDeckDisplayProps> = ({ 
  pitchDeck, 
  onRemove 
}) => {
  if (!pitchDeck) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Pitch Deck Carregado</h4>
      <div className="flex items-center justify-between rounded-md border p-2 text-sm">
        <div className="truncate flex items-center">
          <span className="h-4 w-4 inline-flex items-center justify-center bg-amber-500 text-white rounded-sm mr-2">
            <FileText className="h-2.5 w-2.5" />
          </span>
          <span className="font-medium">{pitchDeck.name}</span>
          <span className="ml-2 text-xs text-muted-foreground">
            ({Math.round(pitchDeck.size / 1024)} KB)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => window.open(pitchDeck.url, '_blank')}
            className="h-8 px-2"
          >
            Visualizar
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 px-2 text-destructive hover:text-destructive"
          >
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
};
