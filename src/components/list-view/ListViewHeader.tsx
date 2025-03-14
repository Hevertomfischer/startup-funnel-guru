
import React from 'react';
import { Filter, Plus, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Startup } from '@/types';
import { exportStartupsToCSV } from '@/utils/export-utils';

interface ListViewHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  startups?: Startup[];
}

const ListViewHeader = ({ searchTerm, setSearchTerm, startups = [] }: ListViewHeaderProps) => {
  const { toast } = useToast();

  const handleAddStartup = () => {
    toast({
      title: "Add startup",
      description: "Opening startup form",
    });
    // Add startup functionality would go here
  };

  const handleExportCSV = () => {
    if (startups.length === 0) {
      toast({
        title: "Export failed",
        description: "No startups to export",
        variant: "destructive",
      });
      return;
    }

    exportStartupsToCSV(startups);
    
    toast({
      title: "Export successful",
      description: `Exported ${startups.length} startups to CSV`,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
            onChange={handleSearchChange}
          />
        </div>
        
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
              By Status
            </DropdownMenuItem>
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
        
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-1" />
          Export CSV
        </Button>
        
        <Button onClick={handleAddStartup}>
          <Plus className="h-4 w-4 mr-1" />
          Add Startup
        </Button>
      </div>
    </div>
  );
};

export default ListViewHeader;
