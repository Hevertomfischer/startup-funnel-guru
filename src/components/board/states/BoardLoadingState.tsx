
import React from 'react';
import { Loader2 } from 'lucide-react';

const BoardLoadingState = () => {
  return (
    <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center flex-col gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <span className="text-lg">Carregando quadro...</span>
      <p className="text-muted-foreground text-sm">Conectando ao banco de dados Supabase</p>
    </div>
  );
};

export default BoardLoadingState;
