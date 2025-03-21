
import React from 'react';
import { Loader2 } from 'lucide-react';

const BoardLoadingState = () => {
  return (
    <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center flex-col gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <span className="text-lg">Carregando quadro...</span>
      <p className="text-muted-foreground text-sm">Conectando ao banco de dados Supabase</p>
      <div className="text-xs text-muted-foreground mt-2 max-w-md text-center">
        <p>Se o carregamento persistir, pode haver um problema com a conexão.</p>
        <p className="mt-1">Aguarde alguns instantes ou recarregue a página.</p>
      </div>
    </div>
  );
};

export default BoardLoadingState;
