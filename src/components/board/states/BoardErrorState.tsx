
import React from 'react';
import { AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';

interface BoardErrorStateProps {
  isRetrying: boolean;
  onRetry: () => void;
}

const BoardErrorState = ({ isRetrying, onRetry }: BoardErrorStateProps) => {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center flex-col gap-4">
      <div className="text-center space-y-3">
        <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-2" />
        <h2 className="text-xl font-semibold text-destructive">Falha ao carregar o quadro</h2>
        <p className="text-muted-foreground mt-2">O banco de dados respondeu, mas houve um erro ao buscar os dados</p>
        <button 
          onClick={onRetry}
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
};

export default BoardErrorState;
