import React from 'react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/header/SearchBar';
import { CreateStartupDialog } from '@/components/board/BoardDialogs';
import { Plus, MoreVertical, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BoardHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showCreateDialog: boolean;
  setShowCreateDialog: (show: boolean) => void;
  statuses: any[];
}

const BoardHeader = ({ searchTerm, setSearchTerm, showCreateDialog, setShowCreateDialog, statuses }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Buscar startups..."
      />

      <div className="flex items-center gap-2">
        <Button
          onClick={() => navigate('/import')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 mr-1"
        >
          <Upload className="h-4 w-4" />
          Importar
        </Button>
        
        <Button
          onClick={() => setShowCreateDialog(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Startup
        </Button>
        
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <CreateStartupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        statuses={statuses}
      />
    </div>
  );
};

export default BoardHeader;
