
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
import StartupCard from '@/components/StartupCard';
import { CreateStatusDialog } from '@/components/CreateStatusDialog';
import { 
  useStatusesQuery, 
  useStartupsByStatusQuery,
  useCreateStartupMutation,
  useUpdateStartupMutation
} from '@/hooks/use-supabase-query';
import { useQueryClient } from '@tanstack/react-query';
import { USERS } from '@/data/mockData'; // We'll keep using mock users for now

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
  
  // Fetch startups for each status
  const startupsByStatusQueries = Object.fromEntries(
    columns.map(column => [
      column.id,
      useStartupsByStatusQuery(column.id)
    ])
  );
  
  // Update column startupIds when startups are loaded
  useEffect(() => {
    if (columns.length > 0) {
      const newColumns = [...columns];
      
      columns.forEach((column, index) => {
        const query = startupsByStatusQueries[column.id];
        if (query?.data) {
          newColumns[index].startupIds = query.data.map(startup => startup.id);
        }
      });
      
      setColumns(newColumns);
    }
  }, [columns, startupsByStatusQueries]);
  
  // Get a startup by ID from any status
  const getStartupById = (id: string): any | undefined => {
    for (const columnId in startupsByStatusQueries) {
      const query = startupsByStatusQueries[columnId];
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
                const { isLoading, isError } = startupsByStatusQueries[column.id] || {};
                
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
                        onClick={() => handleAddStartup(column.id)}
                        disabled={createStartupMutation.isPending}
                      >
                        {createStartupMutation.isPending && column.id === createStartupMutation.variables?.status_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <div 
                      className="flex-1 p-2 overflow-y-auto space-y-3"
                      style={{ 
                        scrollbarWidth: 'thin',
                        scrollbarColor: `${status?.color}20 transparent`
                      }}
                    >
                      {isLoading && (
                        <div className="h-20 flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      )}
                      
                      {isError && (
                        <div className="h-20 flex items-center justify-center text-destructive text-sm">
                          Failed to load startups
                        </div>
                      )}
                      
                      {!isLoading && !isError && column.startupIds.map(startupId => {
                        const startup = getStartupById(startupId);
                        
                        if (!startup) return null;
                        
                        // Convert Supabase startup to the format expected by StartupCard
                        const cardStartup: Startup = {
                          id: startup.id,
                          createdAt: startup.created_at ? new Date(startup.created_at) : new Date(),
                          updatedAt: startup.updated_at ? new Date(startup.updated_at) : new Date(),
                          statusId: startup.status_id || '',
                          values: {
                            Startup: startup.name,
                            'Problema que Resolve': startup.problem_solved,
                            Setor: startup.sector,
                            'Modelo de Negócio': startup.business_model,
                            'Site da Startup': startup.website,
                            MRR: startup.mrr,
                            'Quantidade de Clientes': startup.client_count
                          },
                          labels: [], // We'll fetch labels separately in a real implementation
                          priority: startup.priority as 'low' | 'medium' | 'high',
                          assignedTo: startup.assigned_to,
                          dueDate: startup.due_date ? new Date(startup.due_date) : undefined,
                          timeTracking: startup.time_tracking,
                          attachments: [] // We'll fetch attachments separately in a real implementation
                        };
                        
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
                              startup={cardStartup} 
                              statuses={statuses.map(s => ({ id: s.id, name: s.name, color: s.color }))} 
                              users={USERS}
                              onClick={() => handleCardClick(startup)}
                              compact={showCompactCards}
                            />
                          </div>
                        );
                      })}
                      
                      {!isLoading && !isError && column.startupIds.length === 0 && (
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
      
      <CreateStatusDialog
        open={showCreateStatusDialog}
        onOpenChange={setShowCreateStatusDialog}
        onStatusCreated={handleStatusCreated}
      />
    </>
  );
};

export default Board;
