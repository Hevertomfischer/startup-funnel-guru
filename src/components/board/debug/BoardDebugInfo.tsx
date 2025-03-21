
import React from 'react';

interface BoardDebugInfoProps {
  showExtendedDebug: boolean;
  setShowExtendedDebug: (show: boolean) => void;
  loadingStartTime: number;
  statusesCount: number;
  columns: any[] | null;
  mappedQueries: Record<string, any>;
}

const BoardDebugInfo: React.FC<BoardDebugInfoProps> = ({
  showExtendedDebug,
  setShowExtendedDebug,
  loadingStartTime,
  statusesCount,
  columns,
  mappedQueries
}) => {
  if (!showExtendedDebug) return null;
  
  return (
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
  );
};

export default BoardDebugInfo;
