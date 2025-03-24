
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, X } from 'lucide-react';
import { FileItem } from '../hooks/use-attachments';

interface AttachmentItemProps {
  file: FileItem;
  index: number;
  onRemove: (index: number) => void;
}

export const AttachmentItem: React.FC<AttachmentItemProps> = ({ file, index, onRemove }) => {
  return (
    <li className="flex items-center justify-between rounded-md border p-2 text-sm">
      <div className="truncate flex items-center">
        {file.isPitchDeck ? (
          <span className="h-4 w-4 inline-flex items-center justify-center bg-amber-500 text-white rounded-sm mr-2">
            <FileText className="h-2.5 w-2.5" />
          </span>
        ) : (
          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
        )}
        <span className="font-medium">{file.name}</span>
        <span className="ml-2 text-xs text-muted-foreground">
          ({Math.round(file.size / 1024)} KB)
        </span>
        {file.isPitchDeck && (
          <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
            Pitch Deck
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => window.open(file.url, '_blank')}
          className="h-6 px-2"
        >
          Visualizar
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remover</span>
        </Button>
      </div>
    </li>
  );
};
