
import React from 'react';
import BoardHeader from '@/components/BoardHeader';
import BoardContainer from '@/components/board/BoardContainer';
import EmptyBoardState from '@/components/board/states/EmptyBoardState';
import { toast } from '@/components/ui/use-toast';

interface BoardContentProps {
  columns: any[];
  statuses: any[];
  mappedQueries: Record<string, any>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showCompactCards: boolean;
  setShowCompactCards: (show: boolean) => void;
  handleDragStart: (e: React.DragEvent, startupId: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, columnId: string) => void;
  handleDragEnd: () => void;
  draggingStartupId: string | null;
  handleAddStartup: (statusId: string) => void;
  createStartupMutation: any;
  handleCardClick: (startup: any) => void;
  handleDeleteStartup: (startupId: string) => void;
  setShowCreateStatusDialog: (show: boolean) => void;
  setStatusToEdit: (status: any) => void;
  handleColumnDragStart: (e: React.DragEvent, columnId: string) => void;
  handleColumnDragOver: (e: React.DragEvent) => void;
  handleColumnDrop: (e: React.DragEvent, columnId: string) => void;
  handleCreateTask: (startup: any) => void;
}

const BoardContent = ({
  columns,
  statuses,
  mappedQueries,
  searchTerm,
  setSearchTerm,
  showCompactCards,
  setShowCompactCards,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  draggingStartupId,
  handleAddStartup,
  createStartupMutation,
  handleCardClick,
  handleDeleteStartup,
  setShowCreateStatusDialog,
  setStatusToEdit,
  handleColumnDragStart,
  handleColumnDragOver,
  handleColumnDrop,
  handleCreateTask
}: BoardContentProps) => {
  // Function to open the add startup dialog with the first status
  const openAddStartupDialog = () => {
    if (statuses && statuses.length > 0) {
      console.log("Opening add startup dialog with status:", statuses[0]);
      handleAddStartup(statuses[0].id);
    } else {
      console.log("No statuses available to add startup");
      toast({
        title: "Sem colunas",
        description: "Adicione uma coluna primeiro antes de criar uma startup.",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <BoardHeader 
        showCompactCards={showCompactCards}
        setShowCompactCards={setShowCompactCards}
        addNewStartup={openAddStartupDialog}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      
      {columns.length === 0 ? (
        <EmptyBoardState onAddColumn={() => setShowCreateStatusDialog(true)} />
      ) : (
        <BoardContainer
          columns={columns}
          statuses={statuses}
          columnQueries={mappedQueries}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggingStartupId={draggingStartupId}
          onAddStartup={handleAddStartup}
          isPendingAdd={createStartupMutation.isPending}
          pendingAddStatusId={createStartupMutation.isPending ? createStartupMutation.variables?.status_id : null}
          onCardClick={handleCardClick}
          onDeleteStartup={handleDeleteStartup}
          showCompactCards={showCompactCards}
          addNewColumn={() => setShowCreateStatusDialog(true)}
          onEditColumn={setStatusToEdit}
          onColumnDragStart={handleColumnDragStart}
          onColumnDragOver={handleColumnDragOver}
          onColumnDrop={handleColumnDrop}
          onCreateTask={handleCreateTask}
        />
      )}
    </div>
  );
};

export default BoardContent;
