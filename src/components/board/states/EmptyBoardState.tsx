
import React from 'react';

interface EmptyBoardStateProps {
  onAddColumn: () => void;
}

const EmptyBoardState = ({ onAddColumn }: EmptyBoardStateProps) => {
  return (
    <div className="w-full h-full flex-1 flex items-center justify-center flex-col gap-4">
      <div className="text-center space-y-3">
        <h2 className="text-xl font-semibold">Sem colunas</h2>
        <p className="text-muted-foreground">
          Adicione sua primeira coluna para começar a organizar suas startups.
        </p>
        <button 
          onClick={onAddColumn}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Adicionar coluna
        </button>
      </div>
    </div>
  );
};

export default EmptyBoardState;
