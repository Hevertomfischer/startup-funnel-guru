
import React, { useState, useEffect } from 'react';
import { useBoardState } from '@/hooks/board/use-board-state';
import { useConnectionCheck } from '@/hooks/board/use-connection-check';
import BoardContent from '@/components/board/BoardContent';
import BoardDialogs from '@/components/board/BoardDialogs';
import BoardLoadingState from '@/components/board/states/BoardLoadingState';
import BoardErrorState from '@/components/board/states/BoardErrorState';
import ConnectionErrorState from '@/components/board/states/ConnectionErrorState';
import EmptyBoardState from '@/components/board/states/EmptyBoardState';
import { toast } from '@/components/ui/use-toast';

const BoardView = () => {
  // Estado do componente
  const [showCompactCards, setShowCompactCards] = useState(false);
  const [loadingStartTime] = useState(Date.now());
  const [showExtendedDebug, setShowExtendedDebug] = useState(false);
  
  // Verificar conexão com Supabase
  const { connectionError, isRetrying, statusesCount, handleRetryConnection } = useConnectionCheck();
  
  // Usar o hook de estado do board para obter todos os dados e manipuladores
  const boardState = useBoardState();
  
  const {
    // Estado do board
    columns,
    statuses,
    isLoadingStatuses,
    isErrorStatuses,
    mappedQueries,
    searchTerm,
    setSearchTerm,
    
    // Manipuladores
    getStartupById,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggingStartupId,
    handleDeleteStartup,
    handleCreateTask,
    
    // Manipuladores de arrastar coluna
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop,
    
    // Estado do diálogo
    showCreateStatusDialog,
    setShowCreateStatusDialog,
    statusToEdit,
    setStatusToEdit,
    
    // Ações de startup
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
    
    // Manipuladores de toast
    handleStatusCreated,
    handleStatusUpdated
  } = boardState;
  
  // Verificar se está demorando muito para carregar
  useEffect(() => {
    const loadingTimeoutId = setTimeout(() => {
      if (isLoadingStatuses && !connectionError) {
        console.log("Carregamento demorado detectado");
        toast({
          title: "Carregamento demorado",
          description: "O carregamento está demorando mais que o esperado. Tentando reconectar...",
        });
        
        // Mostrar informações de debug adicionais
        setShowExtendedDebug(true);
      }
    }, 10000); // 10 segundos

    return () => clearTimeout(loadingTimeoutId);
  }, [isLoadingStatuses, connectionError]);
  
  // Logs detalhados sobre o estado atual
  console.log("BoardView renderizando", { 
    columnsCount: columns?.length || 0,
    statusesCount: statuses?.length || 0,
    isLoadingStatuses,
    isErrorStatuses,
    hasQueries: Object.keys(mappedQueries || {}).length,
    connectionError,
    loadingTime: (Date.now() - loadingStartTime) / 1000, // tempo de carregamento em segundos
    queriesSummary: Object.entries(mappedQueries || {}).map(([key, val]) => ({
      statusId: key,
      dataCount: (val as any).data?.length || 0,
      isLoading: (val as any).isLoading,
      isError: (val as any).isError
    }))
  });
  
  // Função para mostrar informações de depuração
  const toggleDebugMode = () => {
    setShowExtendedDebug(prev => !prev);
  };
  
  if (connectionError) {
    return (
      <ConnectionErrorState
        isRetrying={isRetrying}
        onRetry={handleRetryConnection}
      />
    );
  }
  
  if (isLoadingStatuses) {
    return (
      <div onClick={toggleDebugMode}>
        <BoardLoadingState />
        {showExtendedDebug && (
          <div className="fixed bottom-4 right-4 bg-muted p-4 rounded-md text-xs font-mono overflow-auto max-h-64 max-w-md text-muted-foreground">
            <p className="font-bold mb-2">Informações de Debug:</p>
            <p>Tempo de carregamento: {((Date.now() - loadingStartTime) / 1000).toFixed(1)}s</p>
            <p>Status encontrados: {statusesCount}</p>
            <p>Colunas: {columns?.length || 0}</p>
            <p>Queries: {Object.keys(mappedQueries || {}).length}</p>
            <p className="mt-2 text-primary cursor-pointer" onClick={() => window.location.reload()}>
              Recarregar página
            </p>
          </div>
        )}
      </div>
    );
  }
  
  if (isErrorStatuses) {
    return (
      <BoardErrorState
        isRetrying={isRetrying}
        onRetry={handleRetryConnection}
      />
    );
  }
  
  if (!statuses || statuses.length === 0) {
    return (
      <EmptyBoardState
        onAddColumn={() => setShowCreateStatusDialog(true)}
      />
    );
  }
  
  return (
    <>
      <BoardContent
        columns={columns}
        statuses={statuses}
        mappedQueries={mappedQueries}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showCompactCards={showCompactCards}
        setShowCompactCards={setShowCompactCards}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleDragEnd={handleDragEnd}
        draggingStartupId={draggingStartupId}
        handleAddStartup={handleAddStartup}
        createStartupMutation={createStartupMutation}
        handleCardClick={handleCardClick}
        handleDeleteStartup={handleDeleteStartup}
        setShowCreateStatusDialog={setShowCreateStatusDialog}
        setStatusToEdit={setStatusToEdit}
        handleColumnDragStart={handleColumnDragStart}
        handleColumnDragOver={handleColumnDragOver}
        handleColumnDrop={handleColumnDrop}
        handleCreateTask={handleCreateTask}
      />
      
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
      
      {showExtendedDebug && (
        <div className="fixed bottom-4 right-4 bg-muted p-4 rounded-md text-xs font-mono overflow-auto max-h-64 max-w-md text-muted-foreground">
          <p className="font-bold mb-2">Informações de Debug:</p>
          <p>Tempo de carregamento: {((Date.now() - loadingStartTime) / 1000).toFixed(1)}s</p>
          <p>Status encontrados: {statusesCount}</p>
          <p>Colunas: {columns?.length || 0}</p>
          <p>Queries: {Object.keys(mappedQueries || {}).length}</p>
          <p className="mt-2 text-primary cursor-pointer" onClick={() => setShowExtendedDebug(false)}>
            Fechar debug
          </p>
        </div>
      )}
    </>
  );
};

export default BoardView;
