
import React from 'react';
import { Plus, MoreVertical, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/header/SearchBar';
import { useNavigate } from 'react-router-dom';

interface BoardHeaderProps {
  showCompactCards: boolean;
  setShowCompactCards: (show: boolean) => void;
  addNewStartup: () => void;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ 
  showCompactCards, 
  setShowCompactCards, 
  addNewStartup, 
  searchTerm, 
  onSearchChange 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-4">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={(value) => onSearchChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
        onSearch={(value) => onSearchChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
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
          onClick={addNewStartup}
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
    </div>
  );
};

export default BoardHeader;
