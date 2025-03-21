
import { useStartupsByStatusQuery } from './queries/startups';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

// Definir um tipo para possíveis erros
type QueryError = Error | PostgrestError | string | unknown;

export const useStartupsByStatus = (statusId: string) => {
  const { toast } = useToast();
  const [isFirstAttempt, setIsFirstAttempt] = useState(true);
  const [hasVerifiedTable, setHasVerifiedTable] = useState(false);
  
  // Log para acompanhar o fluxo da aplicação
  console.log(`useStartupsByStatus hook inicializado para statusId ${statusId}`, {
    isPlaceholder: statusId.startsWith('placeholder-'),
  });
  
  // Verificação única da existência da tabela
  useEffect(() => {
    const verifyTableStructure = async () => {
      if (hasVerifiedTable || statusId.startsWith('placeholder-')) return;
      
      try {
        console.log(`Verificando estrutura da tabela startups para statusId ${statusId}`);
        const { error: supabaseError } = await supabase.from('startups').select('count');
        
        if (supabaseError) {
          console.error('Erro ao verificar estrutura da tabela startups:', supabaseError);
          toast({
            title: "Erro estrutural",
            description: `Problema ao acessar a tabela 'startups': ${supabaseError.message}`,
            variant: "destructive",
          });
        } else {
          console.log('Tabela startups existe e está acessível');
        }
      } catch (e) {
        console.error('Erro ao verificar tabela startups:', e);
      } finally {
        setHasVerifiedTable(true);
      }
    };
    
    verifyTableStructure();
  }, [statusId, hasVerifiedTable, toast]);
  
  // Use o hook de query no nível superior com um statusId válido
  const query = useStartupsByStatusQuery(statusId);
  
  // Monitorar primeiro carregamento para feedback
  useEffect(() => {
    if (isFirstAttempt && !statusId.startsWith('placeholder-') && (query.isSuccess || query.isError)) {
      if (query.isSuccess) {
        console.log(`Primeira query para status ${statusId} completada com sucesso:`, {
          dataLength: query.data?.length || 0
        });
      }
      
      if (query.isError) {
        console.error(`Primeira query para status ${statusId} falhou:`, query.error);
      }
      
      setIsFirstAttempt(false);
    }
  }, [query.isSuccess, query.isError, query.data, query.error, statusId, isFirstAttempt]);
  
  // Adicionar logging mais detalhado para solucionar problemas de conectividade com o Supabase
  useEffect(() => {
    // Extrair erro de forma segura para logging
    const errorForLogging = query.error
      ? (typeof query.error === 'object' 
        ? (query.error instanceof Error || 'message' in query.error)
          ? String((query.error as Error | { message: unknown }).message)
          : JSON.stringify(query.error)
        : String(query.error))
      : null;
      
    console.log(`useStartupsByStatus hook para statusId ${statusId}:`, {
      dataLength: query.data ? query.data.length : 0,
      hasData: Boolean(query.data),
      isLoading: query.isLoading,
      isError: query.isError,
      error: errorForLogging,
      isFetching: query.isFetching,
      isFetched: query.isFetched,
      isPlaceholder: statusId.startsWith('placeholder-'),
      status: query.status,
      statusIds: query.data ? query.data.map(s => s.id) : [],
      fetchStatus: query.fetchStatus,
      isRefetching: query.isRefetching,
    });
  }, [
    statusId, 
    query.data, 
    query.isLoading, 
    query.isError, 
    query.error, 
    query.isFetching, 
    query.isFetched, 
    query.status,
    query.fetchStatus,
    query.isRefetching
  ]);
  
  // Se houver um erro e não for um ID de placeholder, mostrar toast
  useEffect(() => {
    if (query.error && !statusId.startsWith('placeholder-')) {
      // Obter a mensagem de erro de forma segura
      let errorMessage: string;
      
      if (query.error instanceof Error) {
        errorMessage = query.error.message;
      } else if (typeof query.error === 'object' && query.error !== null) {
        if ('message' in query.error && query.error.message) {
          errorMessage = String(query.error.message);
        } else {
          errorMessage = JSON.stringify(query.error);
        }
      } else if (typeof query.error === 'string') {
        errorMessage = query.error;
      } else {
        errorMessage = 'Erro desconhecido';
      }
          
      console.error(`Erro ao buscar startups para status ${statusId}:`, errorMessage);
      
      // Evitar mostrar muitos toasts repetidos
      if (isFirstAttempt) {
        toast({
          title: "Erro ao carregar dados",
          description: `Não foi possível carregar as startups (${errorMessage}). Tentando novamente...`,
          variant: "destructive",
        });
      }
    }
  }, [query.error, statusId, toast, isFirstAttempt]);
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
