
import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BoardLoadingState = () => {
  const [extendedTime, setExtendedTime] = useState(false);
  const [loadStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    // Atualiza o contador de tempo a cada segundo
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - loadStartTime) / 1000);
      setElapsedTime(elapsed);
      
      if (elapsed > 10 && !extendedTime) {
        setExtendedTime(true);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [loadStartTime, extendedTime]);

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center flex-col gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <span className="text-lg">Carregando quadro...</span>
      <p className="text-muted-foreground text-sm">Conectando ao banco de dados Supabase</p>
      
      {extendedTime && (
        <div className="mt-4 space-y-2">
          <div className="text-amber-600 font-medium">
            O carregamento está demorando mais que o esperado ({elapsedTime}s)
          </div>
          
          <div className="text-xs text-muted-foreground mt-2 max-w-md text-center">
            <p>Possíveis razões:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Problemas de conectividade com o banco Supabase</li>
              <li>Banco de dados ainda não foi inicializado com dados</li>
              <li>Credenciais ou configuração incorreta</li>
            </ul>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="mt-2 flex items-center gap-2"
            onClick={() => window.location.href = '/diagnostico'}
          >
            <RefreshCw className="h-4 w-4" />
            Executar Diagnóstico
          </Button>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground mt-2 max-w-md text-center">
        <p>Tempo de carregamento: {elapsedTime} segundos</p>
        {!extendedTime && (
          <p className="mt-1">Aguarde alguns instantes ou recarregue a página.</p>
        )}
      </div>
    </div>
  );
};

export default BoardLoadingState;
