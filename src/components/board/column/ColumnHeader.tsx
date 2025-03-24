
import React from 'react';
import { Loader2, Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColumnHeaderProps {
  title: string;
  color: string;
  count: number;
  onEditColumn?: () => void;
  onAddStartup: (statusId: string) => void;
  id: string;
  isPendingAdd: boolean;
  pendingAddStatusId: string | null;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  title,
  color,
  count,
  onEditColumn,
  onAddStartup,
  id,
  isPendingAdd,
  pendingAddStatusId
}) => {
  return (
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
          {count}
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
  );
};

export default ColumnHeader;
