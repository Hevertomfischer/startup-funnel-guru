import React from 'react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/header/SearchBar';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload } from 'lucide-react';

interface ListViewHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  startups: any[];
}

const ListViewHeader: React.FC<ListViewHeaderProps> = ({ searchTerm, setSearchTerm, startups }) => {
  const navigate = useNavigate();
  
  return (
    <div className="sticky top-0 z-10 bg-background p-4 border-b flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold mr-4">Startups</h1>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Buscar startups..."
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          onClick={() => navigate('/import')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Importar
        </Button>
        
        <Button
          onClick={() => navigate('/board')}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Startup
        </Button>
      </div>
    </div>
  );
};

export default ListViewHeader;
