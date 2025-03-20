
import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import BoardHeader from '@/components/BoardHeader';
import BoardContainer from '@/components/board/BoardContainer';
import BoardDialogs from '@/components/board/BoardDialogs';
import { useBoardState } from '@/hooks/board/use-board-state';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const BoardView = () => {
  // Component state
  const [showCompactCards, setShowCompactCards] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Check Supabase connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsRetrying(true);
        
        // Simple query to test connection and fetch statuses
        console.log("Checking Supabase connection in BoardView");
        const { data, error } = await supabase.from('statuses').select('*');
        
        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionError(true);
          toast({
            title: "Erro de conexão",
            description: "Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet.",
            variant: "destructive",
          });
        } else {
          console.log('Supabase connection successful, found statuses:', data?.length || 0);
          setConnectionError(false);
          
          // If no statuses exist, let's try to check if startups exist directly
          if (!data || data.length === 0) {
            const { data: startups, error: startupError } = await supabase
              .from('startups')
              .select('count');
              
            if (startupError) {
              console.error('Error checking startups:', startupError);
            } else {
              console.log('Found startups in database:', startups);
            }
          }
        }
      } catch (error) {
        console.error('Unexpected error checking Supabase connection:', error);
        setConnectionError(true);
      } finally {
        setIsRetrying(false);
      }
    };
    
    checkConnection();
  }, []);
  
  // Use the board state hook to get all the data and handlers
  const boardState = useBoardState();
  
  const {
    // Board state
    columns,
    statuses,
    isLoadingStatuses,
    isErrorStatuses,
    mappedQueries,
    searchTerm,
    setSearchTerm,
    
    // Handlers
    getStartupById,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggingStartupId,
    handleDeleteStartup,
    handleCreateTask,
    
    // Column drag handlers
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop,
    
    // Dialog state
    showCreateStatusDialog,
    setShowCreateStatusDialog,
    statusToEdit,
    setStatusToEdit,
    
    // Startup actions
    handleAddStartup,
    handleCardClick,
    handleCreateStartup,
    handleUpdateStartup,
    createStartupMutation,
    updateStartupMutation,
    selectedStartup,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    
    // Toast handlers
    handleStatusCreated,
    handleStatusUpdated
  } = boardState;
  
  console.log("BoardView rendering", { 
    columnsCount: columns?.length || 0,
    statusesCount: statuses?.length || 0,
    isLoadingStatuses,
    isErrorStatuses,
    hasQueries: Object.keys(mappedQueries || {}).length,
    connectionError
  });
  
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
  
  const handleRetryConnection = () => {
    window.location.reload();
  };
  
  if (connectionError) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center flex-col gap-4">
        <div className="text-center space-y-3">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-2" />
          <h2 className="text-xl font-semibold text-destructive">Erro de conexão</h2>
          <p className="text-muted-foreground">Não foi possível conectar ao banco de dados.</p>
          <button 
            onClick={handleRetryConnection}
            disabled={isRetrying}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-2 mx-auto"
          >
            {isRetrying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
  
  if (isLoadingStatuses) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span className="text-lg">Carregando quadro...</span>
        <p className="text-muted-foreground text-sm">Conectando ao banco de dados Supabase</p>
      </div>
    );
  }
  
  if (isErrorStatuses) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center flex-col gap-4">
        <div className="text-center space-y-3">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-2" />
          <h2 className="text-xl font-semibold text-destructive">Falha ao carregar o quadro</h2>
          <p className="text-muted-foreground mt-2">O banco de dados respondeu, mas houve um erro ao buscar os dados</p>
          <button 
            onClick={handleRetryConnection}
            disabled={isRetrying}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            {isRetrying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Recarregar página
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <BoardHeader 
          showCompactCards={showCompactCards}
          setShowCompactCards={setShowCompactCards}
          addNewStartup={openAddStartupDialog}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
        
        {columns.length === 0 ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-4">
            <div className="text-center space-y-3">
              <h2 className="text-xl font-semibold">Sem colunas</h2>
              <p className="text-muted-foreground">
                Adicione sua primeira coluna para começar a organizar suas startups.
              </p>
              <button 
                onClick={() => setShowCreateStatusDialog(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Adicionar coluna
              </button>
            </div>
          </div>
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
      
      <BoardDialogs
        showCreateStatusDialog={showCreateStatusDialog}
        setShowCreateStatusDialog={setShowCreateStatusDialog}
        statusToEdit={statusToEdit}
        setStatusToEdit={setStatusToEdit}
        showCreateDialog={showCreateDialog}
        setShowCreateDialog={setShowCreateDialog}
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        selectedStartup={selectedStartup}
        statuses={statuses}
        handleStatusCreated={handleStatusCreated}
        handleStatusUpdated={handleStatusUpdated}
        handleCreateStartup={handleCreateStartup}
        handleUpdateStartup={handleUpdateStartup}
        createStartupMutation={createStartupMutation}
        updateStartupMutation={updateStartupMutation}
      />
    </>
  );
};

export default BoardView;
