
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface StartupTableHeaderProps {
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: string) => void;
}

const StartupTableHeader = ({ sortField, sortDirection, handleSort }: StartupTableHeaderProps) => {
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 ml-1" /> 
      : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  return (
    <TableHeader className="bg-muted/50">
      <TableRow>
        <TableHead className="w-[250px]">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleSort('Startup')}
          >
            Startup Name
            {renderSortIcon('Startup')}
          </div>
        </TableHead>
        <TableHead className="w-[150px]">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleSort('Setor')}
          >
            Sector
            {renderSortIcon('Setor')}
          </div>
        </TableHead>
        <TableHead className="w-[150px]">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleSort('Modelo de Negócio')}
          >
            Business Model
            {renderSortIcon('Modelo de Negócio')}
          </div>
        </TableHead>
        <TableHead className="text-right w-[150px]">
          <div 
            className="flex items-center justify-end cursor-pointer" 
            onClick={() => handleSort('MRR')}
          >
            MRR
            {renderSortIcon('MRR')}
          </div>
        </TableHead>
        <TableHead className="text-right w-[150px]">
          <div 
            className="flex items-center justify-end cursor-pointer" 
            onClick={() => handleSort('Quantidade de Clientes')}
          >
            Clients
            {renderSortIcon('Quantidade de Clientes')}
          </div>
        </TableHead>
        <TableHead className="w-[120px]">
          <div className="flex items-center">
            Status
          </div>
        </TableHead>
        <TableHead className="w-[100px]">
          <div className="flex items-center">
            Priority
          </div>
        </TableHead>
        <TableHead className="w-[120px]">
          <div className="flex items-center">
            Assigned To
          </div>
        </TableHead>
        <TableHead className="w-[120px]">
          <div className="flex items-center">
            Due Date
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default StartupTableHeader;
