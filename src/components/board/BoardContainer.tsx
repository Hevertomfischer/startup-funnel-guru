
import React from 'react';
import { ChevronLeft, ChevronRight, Plus, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BoardColumn from '@/components/board/BoardColumn';
import { Column, Status } from '@/types';
import { USERS } from '@/data/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BoardContainerProps {
  columns: Column[];
  statuses: Status[];
  columnQueries: Record<string, { data: any[], isLoading: boolean, isError: boolean }>;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, startupId: string) => void;
  onDragEnd: () => void;
  draggingStartupId: string | null;
  onAddStartup: (statusId: string) => void;
  isPendingAdd: boolean;
  pendingAddStatusId: string | null;
  onCardClick: (startup: any) => void;
  onDeleteStartup?: (startupId: string) => void;
  showCompactCards: boolean;
  addNewColumn: () => void;
  onEditColumn: (status: Status) => void;
  onColumnDragStart: (e: React.DragEvent, columnId: string) => void;
  onColumnDragOver: (e: React.DragEvent) => void;
  onColumnDrop: (e: React.DragEvent, columnId: string) => void;
  onCreateTask: (startup: any) => void;
  searchTerm?: string;
}

const BoardContainer: React.FC<BoardContainerProps> = ({
  columns,
  statuses,
  columnQueries,
  onDrop,
  onDragOver,
  onDragStart,
  onDragEnd,
  draggingStartupId,
  onAddStartup,
  isPendingAdd,
  pendingAddStatusId,
  onCardClick,
  onDeleteStartup,
  showCompactCards,
  addNewColumn,
  onEditColumn,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  onCreateTask,
  searchTerm = ''
}) => {
  // Log para depuração
  console.log('BoardContainer props:', { 
    columnCount: columns.length, 
    statusCount: statuses.length,
    columnQueriesKeys: Object.keys(columnQueries),
    columnIds: columns.map(c => c.id),
    statusIds: statuses.map(s => s.id),
    searchTerm
  });

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('board-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
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
          {columns && columns.length > 0 ? columns.map((column, index) => {
            const status = statuses.find(s => s.id === column.id);
            
            // CORRIGIDO: Verificação adicional para garantir que a coluna tem um status correspondente
            if (!status) {
              console.error(`No matching status found for column ID: ${column.id}`);
              return null;
            }
            
            const query = columnQueries[column.id] || { 
              isLoading: false, 
              isError: false,
              data: []
            };
            
            // Certifique-se de que a data é um array
            const startups = Array.isArray(query.data) ? query.data : [];
            
            // Log para depuração
            console.log(`Column ${column.id} (${column.title}):`, {
              hasData: !!query.data,
              startupCount: startups.length,
              isLoading: query.isLoading,
              isError: query.isError,
              statusId: status.id,
              statusName: status.name
            });
            
            return (
              <div 
                key={column.id} 
                className="h-full"
                onDragOver={onColumnDragOver}
                onDrop={(e) => {
                  console.log('Column drop event on column:', column.id, status.id);
                  onColumnDrop(e, column.id);
                }}
              >
                <div 
                  className="flex items-center mb-2 cursor-move"
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation();
                    onColumnDragStart(e, column.id);
                  }}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground mr-1" />
                </div>
                <BoardColumn
                  id={column.id}
                  title={column.title}
                  color={status?.color || '#e2e8f0'}
                  startups={startups}
                  startupIds={column.startupIds || []}
                  isLoading={query?.isLoading || false}
                  isError={query?.isError || false}
                  onDrop={(e) => {
                    console.log('BoardColumn onDrop called with columnId:', column.id);
                    onDrop(e, column.id);
                  }}
                  onDragOver={onDragOver}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  draggingStartupId={draggingStartupId}
                  onAddStartup={onAddStartup}
                  isPendingAdd={isPendingAdd}
                  pendingAddStatusId={pendingAddStatusId}
                  onCardClick={onCardClick}
                  onDeleteStartup={onDeleteStartup}
                  showCompactCards={showCompactCards}
                  statuses={statuses.map(s => ({ id: s.id, name: s.name, color: s.color }))}
                  users={USERS}
                  onEditColumn={status ? () => onEditColumn(status) : undefined}
                  onCreateTask={onCreateTask}
                  searchTerm={searchTerm}
                />
              </div>
            );
          }) : (
            <div className="flex items-center justify-center w-full h-32 text-muted-foreground">
              No columns found. Add a column to get started.
            </div>
          )}
          
          {/* Make the "Add Column" button always visible and positioned on the right side */}
          <div className="h-full min-w-[280px] flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={addNewColumn} 
              className="w-full border-dashed mt-12"
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
  );
};

export default BoardContainer;
