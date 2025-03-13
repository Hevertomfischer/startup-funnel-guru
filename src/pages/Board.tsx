
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { Startup, Column, Status } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import StartupCard from '@/components/StartupCard';
import { 
  MOCK_STARTUPS, 
  INITIAL_COLUMNS, 
  STATUSES, 
  USERS
} from '@/data/mockData';

const Board = () => {
  const { toast } = useToast();
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [startups] = useState<Startup[]>(MOCK_STARTUPS);
  const [draggingStartupId, setDraggingStartupId] = useState<string | null>(null);
  const [showCompactCards, setShowCompactCards] = useState(false);
  
  // Find a startup by ID
  const getStartupById = (id: string) => startups.find(s => s.id === id);
  
  // Handle card click
  const handleCardClick = (startup: Startup) => {
    toast({
      title: "Startup details",
      description: `Opening details for ${startup.values.Startup}`,
    });
    // Navigate to startup details page would go here
  };
  
  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, startupId: string) => {
    e.dataTransfer.setData('text/plain', startupId);
    setDraggingStartupId(startupId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const startupId = e.dataTransfer.getData('text/plain');
    
    // Remove from old column
    const newColumns = columns.map(col => ({
      ...col,
      startupIds: col.startupIds.filter(id => id !== startupId)
    }));
    
    // Add to new column
    const targetColumnIndex = newColumns.findIndex(col => col.id === columnId);
    if (targetColumnIndex !== -1) {
      newColumns[targetColumnIndex].startupIds.push(startupId);
      setColumns(newColumns);
      
      // In a real app, you'd update the startup status here
      toast({
        title: "Startup moved",
        description: `Startup moved to ${columns[targetColumnIndex].title}`,
      });
    }
    
    setDraggingStartupId(null);
  };
  
  const handleDragEnd = () => {
    setDraggingStartupId(null);
  };
  
  // UI helpers
  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('board-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  const addNewColumn = () => {
    toast({
      title: "Adding new column",
      description: "This would open a new column creation dialog",
    });
  };
  
  const statusColorMap: { [key: string]: string } = {};
  STATUSES.forEach(status => {
    statusColorMap[status.id] = status.color;
  });
  
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold">Startup Pipeline</h1>
          <p className="text-muted-foreground">
            Manage your startup investment funnel
          </p>
        </div>
        <div className="flex items-center gap-2">
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
      
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
          <Button
            variant="outline" 
            size="icon" 
            className="rounded-full bg-background shadow-md"
            onClick={() => scrollContainer('left')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div 
          id="board-container"
          className="h-full overflow-x-auto overflow-y-hidden px-4 pb-4"
        >
          <div className="flex h-full gap-4 pt-4">
            {columns.map(column => {
              const status = STATUSES.find(s => s.id === column.id);
              
              return (
                <div 
                  key={column.id}
                  className="flex flex-col h-full bg-accent/50 backdrop-blur-sm rounded-xl min-w-[280px] w-[280px] shadow-sm border"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  <div 
                    className="p-3 flex items-center justify-between"
                    style={{ 
                      borderBottom: `1px solid ${status?.color}40` 
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: status?.color || '#e2e8f0' }}
                      />
                      <h3 className="font-medium">{column.title}</h3>
                      <div className="flex items-center justify-center rounded-full bg-muted w-6 h-6 text-xs font-medium">
                        {column.startupIds.length}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0" 
                      onClick={() => {
                        toast({
                          title: "Add startup",
                          description: `Adding startup to ${column.title}`,
                        });
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div 
                    className="flex-1 p-2 overflow-y-auto space-y-3"
                    style={{ 
                      scrollbarWidth: 'thin',
                      scrollbarColor: `${status?.color}20 transparent`
                    }}
                  >
                    {column.startupIds.map(startupId => {
                      const startup = getStartupById(startupId);
                      
                      if (!startup) return null;
                      
                      return (
                        <div
                          key={startupId}
                          draggable
                          onDragStart={(e) => handleDragStart(e, startupId)}
                          onDragEnd={handleDragEnd}
                          className={cn(
                            "transition-opacity duration-200",
                            draggingStartupId === startupId ? "opacity-50" : "opacity-100"
                          )}
                        >
                          <StartupCard 
                            startup={startup} 
                            statuses={STATUSES} 
                            users={USERS}
                            onClick={handleCardClick}
                            compact={showCompactCards}
                          />
                        </div>
                      );
                    })}
                    
                    {column.startupIds.length === 0 && (
                      <div className="h-20 flex items-center justify-center border border-dashed rounded-md text-muted-foreground text-sm">
                        Drop startups here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            <div className="h-full min-w-[280px] flex items-start pt-4">
              <Button 
                variant="outline" 
                onClick={addNewColumn} 
                className="w-full border-dashed"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Column
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background shadow-md"
            onClick={() => scrollContainer('right')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Board;
