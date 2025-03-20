
import React from 'react';
import { AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';

interface ConnectionErrorStateProps {
  isRetrying: boolean;
  onRetry: () => void;
}

const ConnectionErrorState = ({ isRetrying, onRetry }: ConnectionErrorStateProps) => {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center flex-col gap-4">
      <div className="text-center space-y-3">
        <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-2" />
        <h2 className="text-xl font-semibold text-destructive">Erro de conexão</h2>
        <p className="text-muted-foreground">Não foi possível conectar ao banco de dados.</p>
        <button 
          onClick={onRetry}
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
};

export default ConnectionErrorState;
