
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import { Startup } from '@/types';
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
import { CreateStatusDialog } from '@/components/CreateStatusDialog';
import { 
  useStatusesQuery, 
  useCreateStartupMutation,
  useUpdateStartupMutation
} from '@/hooks/use-supabase-query';
import { useStartupsByStatus } from '@/hooks/use-startups-by-status';
import { useQueryClient } from '@tanstack/react-query';
import { USERS } from '@/data/mockData'; // We'll keep using mock users for now
import BoardColumn from '@/components/BoardColumn';

// Helper interface for our board columns
interface Column {
  id: string;
  title: string;
  startupIds: string[];
}

const Board = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [draggingStartupId, setDraggingStartupId] = useState<string | null>(null);
  const [showCompactCards, setShowCompactCards] = useState(false);
  const [showCreateStatusDialog, setShowCreateStatusDialog] = useState(false);
  
  // Fetch statuses from Supabase
  const { 
    data: statuses = [], 
    isLoading: isLoadingStatuses,
    isError: isErrorStatuses
  } = useStatusesQuery();
  
  // Create columns based on statuses
  const [columns, setColumns] = useState<Column[]>([]);
  
  // Update columns when statuses are loaded
  useEffect(() => {
    if (statuses.length > 0) {
      const newColumns = statuses.map(status => ({
        id: status.id,
        title: status.name,
        startupIds: []
      }));
      setColumns(newColumns);
    }
  }, [statuses]);
  
  // Create an object to store our query results per column
  const columnQueries = columns.reduce((acc, column) => {
    const { data, isLoading, isError } = useStartupsByStatus(column.id);
    acc[column.id] = { data, isLoading, isError };
    return acc;
  }, {} as Record<string, { data: any[], isLoading: boolean, isError: boolean }>);
  
  // Update column startupIds when startups are loaded
  useEffect(() => {
    if (columns.length > 0 && Object.keys(columnQueries).length > 0) {
      const newColumns = [...columns];
      
      columns.forEach((column, index) => {
        const query = columnQueries[column.id];
        if (query?.data) {
          newColumns[index].startupIds = query.data.map(startup => startup.id);
        }
      });
      
      setColumns(newColumns);
    }
  }, [columns, columnQueries]);
  
  // Get a startup by ID from any status
  const getStartupById = (id: string): any | undefined => {
    for (const columnId in columnQueries) {
      const query = columnQueries[columnId];
      const startup = query?.data?.find(s => s.id === id);
      if (startup) return startup;
    }
    return undefined;
  };
  
  // Mutations for updating startups
  const updateStartupMutation = useUpdateStartupMutation();
  
  // Handle card click
  const handleCardClick = (startup: any) => {
    toast({
      title: "Startup details",
      description: `Opening details for ${startup.name}`,
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
    const startup = getStartupById(startupId);
    
    if (startup && startup.status_id !== columnId) {
      // Update the startup's status in Supabase
      updateStartupMutation.mutate({
        id: startupId,
        startup: { status_id: columnId }
      });
      
      // Update local state to show the change immediately
      const newColumns = columns.map(col => ({
        ...col,
        startupIds: col.id === columnId 
          ? [...col.startupIds, startupId] 
          : col.startupIds.filter(id => id !== startupId)
      }));
      
      setColumns(newColumns);
      
      const newStatus = statuses.find(s => s.id === columnId);
      toast({
        title: "Startup moved",
        description: `Startup moved to ${newStatus?.name || 'new status'}`,
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
    setShowCreateStatusDialog(true);
  };
  
  const handleStatusCreated = () => {
    // Invalidate statuses query to refresh the columns
    queryClient.invalidateQueries({ queryKey: ['statuses'] });
    
    toast({
      title: "Column added",
      description: "New column has been added to the board",
    });
  };
  
  // Create new startup mutation
  const createStartupMutation = useCreateStartupMutation();
  
  const handleAddStartup = (statusId: string) => {
    // In a real app, this would open a form to create a new startup
    // For now, we'll create a simple startup with default values
    createStartupMutation.mutate({
      name: `New Startup ${Date.now()}`,
      status_id: statusId,
      priority: 'medium',
      description: null,
      problem_solved: null,
      sector: null,
      business_model: null,
      website: null,
      mrr: null,
      client_count: null,
      assigned_to: null,
      due_date: null,
      time_tracking: 0
    });
  };
  
  if (isLoadingStatuses) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading board...</span>
      </div>
    );
  }
  
  if (isErrorStatuses) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Failed to load board</h2>
          <p className="text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
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
                const status = statuses.find(s => s.id === column.id);
                const { isLoading, isError, data = [] } = columnQueries[column.id] || { 
                  isLoading: false, 
                  isError: false,
                  data: []
                };
                
                return (
                  <BoardColumn
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    color={status?.color || '#e2e8f0'}
                    startups={data}
                    startupIds={column.startupIds}
                    isLoading={isLoading}
                    isError={isError}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    draggingStartupId={draggingStartupId}
                    onAddStartup={handleAddStartup}
                    isPendingAdd={createStartupMutation.isPending}
                    pendingAddStatusId={createStartupMutation.isPending ? createStartupMutation.variables?.status_id : null}
                    onCardClick={handleCardClick}
                    showCompactCards={showCompactCards}
                    statuses={statuses.map(s => ({ id: s.id, name: s.name, color: s.color }))}
                    users={USERS}
                  />
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
      
      <CreateStatusDialog
        open={showCreateStatusDialog}
        onOpenChange={setShowCreateStatusDialog}
        onStatusCreated={handleStatusCreated}
      />
    </>
  );
};

export default Board;
