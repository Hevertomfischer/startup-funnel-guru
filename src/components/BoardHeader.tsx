
import React from 'react';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

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
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h1 className="text-2xl font-semibold">Startup Pipeline</h1>
        <p className="text-muted-foreground">
          Manage your startup investment funnel
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search startups..."
            className="w-full pl-8 bg-background"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
        
        <Button
          variant="default"
          size="sm"
          onClick={addNewStartup}
        >
          Add Startup
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCompactCards(!showCompactCards)}
        >
          {showCompactCards ? 'Detailed View' : 'Compact View'}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Startups</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              By Priority
            </DropdownMenuItem>
            <DropdownMenuItem>
              By Label
            </DropdownMenuItem>
            <DropdownMenuItem>
              By Assigned User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort Startups</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              By MRR
            </DropdownMenuItem>
            <DropdownMenuItem>
              By Created Date
            </DropdownMenuItem>
            <DropdownMenuItem>
              By Due Date
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default BoardHeader;
