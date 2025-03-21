
import React from 'react';
import BoardLoadingState from './BoardLoadingState';
import BoardErrorState from './BoardErrorState';
import ConnectionErrorState from './ConnectionErrorState';
import EmptyBoardState from './EmptyBoardState';

interface BoardStateManagerProps {
  connectionError: boolean;
  isRetrying: boolean;
  handleRetryConnection: () => void;
  isLoadingStatuses: boolean;
  isErrorStatuses: boolean;
  statuses: any[] | null;
  showExtendedDebug: boolean;
  toggleDebugMode: () => void;
  loadingStartTime: number;
  statusesCount: number;
  columns: any[] | null;
  setShowCreateStatusDialog: (show: boolean) => void;
  children: React.ReactNode;
}

const BoardStateManager: React.FC<BoardStateManagerProps> = ({
  connectionError,
  isRetrying,
  handleRetryConnection,
  isLoadingStatuses,
  isErrorStatuses,
  statuses,
  showExtendedDebug,
  toggleDebugMode,
  loadingStartTime,
  statusesCount,
  columns,
  setShowCreateStatusDialog,
  children
}) => {
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
  
  return <>{children}</>;
};

export default BoardStateManager;
