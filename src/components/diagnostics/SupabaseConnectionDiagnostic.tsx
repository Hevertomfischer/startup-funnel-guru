
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Tables } from '@/integrations/supabase/client';

// Define the tables we want to check
const TABLES_TO_CHECK = ['startups', 'statuses', 'team_members', 'attachments'] as const;
type TableName = typeof TABLES_TO_CHECK[number];

// Define result types
type CheckStatus = 'checking' | 'success' | 'error';
type TableResult = { status: CheckStatus, count?: number, message: string };

const SupabaseConnectionDiagnostic = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [results, setResults] = useState<{
    connection: { status: CheckStatus, message: string },
    tables: Record<TableName, TableResult>
  }>({
    connection: { status: 'checking', message: 'Verificando conexão com Supabase...' },
    tables: {
      startups: { status: 'checking', message: 'Verificando tabela startups...' },
      statuses: { status: 'checking', message: 'Verificando tabela statuses...' },
      team_members: { status: 'checking', message: 'Verificando tabela team_members...' },
      attachments: { status: 'checking', message: 'Verificando tabela attachments...' }
    }
  });
  
  const runDiagnostics = async () => {
    setIsChecking(true);
    setResults({
      connection: { status: 'checking', message: 'Verificando conexão com Supabase...' },
      tables: {
        startups: { status: 'checking', message: 'Verificando tabela startups...' },
        statuses: { status: 'checking', message: 'Verificando tabela statuses...' },
        team_members: { status: 'checking', message: 'Verificando tabela team_members...' },
        attachments: { status: 'checking', message: 'Verificando tabela attachments...' }
      }
    });

    try {
      // Test basic connection
      console.log('Teste de conexão básica com Supabase...');
      const { data: connectionTest, error: connectionError } = await supabase.from('statuses').select('count');
      
      if (connectionError) {
        console.error('Erro de conexão básica:', connectionError);
        setResults(prev => ({
          ...prev,
          connection: { 
            status: 'error', 
            message: `Falha na conexão com Supabase: ${connectionError.message}` 
          }
        }));
        setIsChecking(false);
        return;
      }
      
      console.log('Conexão básica bem-sucedida:', connectionTest);
      setResults(prev => ({
        ...prev,
        connection: { 
          status: 'success', 
          message: 'Conexão com Supabase estabelecida com sucesso' 
        }
      }));
      
      // Check tables one by one
      for (const table of TABLES_TO_CHECK) {
        try {
          console.log(`Verificando tabela ${table}...`);
          // Type assertion to ensure table is a valid table name
          const { data, error } = await supabase
            .from(table)
            .select('count');
          
          if (error) {
            console.error(`Erro ao verificar tabela ${table}:`, error);
            setResults(prev => ({
              ...prev,
              tables: {
                ...prev.tables,
                [table]: { 
                  status: 'error', 
                  message: `Erro ao acessar tabela ${table}: ${error.message}` 
                }
              }
            }));
          } else {
            const count = data?.[0]?.count || 0;
            console.log(`Tabela ${table} verificada com sucesso. Registros encontrados: ${count}`);
            setResults(prev => ({
              ...prev,
              tables: {
                ...prev.tables,
                [table]: { 
                  status: 'success', 
                  count,
                  message: `Tabela ${table} verificada. Registros encontrados: ${count}` 
                }
              }
            }));
          }
        } catch (e) {
          console.error(`Erro inesperado ao verificar tabela ${table}:`, e);
          setResults(prev => ({
            ...prev,
            tables: {
              ...prev.tables,
              [table]: { 
                status: 'error', 
                message: `Erro inesperado ao verificar tabela ${table}: ${e instanceof Error ? e.message : String(e)}` 
              }
            }
          }));
        }
      }
    } catch (e) {
      console.error('Erro inesperado durante o diagnóstico:', e);
      setResults(prev => ({
        ...prev,
        connection: { 
          status: 'error', 
          message: `Erro inesperado: ${e instanceof Error ? e.message : String(e)}`
        }
      }));
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const StatusIcon = ({ status }: { status: CheckStatus }) => {
    if (status === 'checking') return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    if (status === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Diagnóstico da Conexão Supabase</h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
          <StatusIcon status={results.connection.status} />
          <div className="flex-1">
            <p className="font-medium">{results.connection.message}</p>
          </div>
        </div>
        
        <h3 className="text-lg font-medium mt-4">Tabelas do Banco</h3>
        
        <div className="space-y-2">
          {Object.entries(results.tables).map(([table, result]) => (
            <div key={table} className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
              <StatusIcon status={result.status} />
              <div className="flex-1">
                <p className="font-medium">{result.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 flex gap-2">
        <Button 
          onClick={runDiagnostics} 
          disabled={isChecking}
          className="flex items-center gap-2"
        >
          {isChecking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isChecking ? 'Verificando...' : 'Executar Verificação Novamente'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          Recarregar Página
        </Button>
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground border-t pt-4">
        <h4 className="font-medium mb-2">Informações de Conexão</h4>
        <div className="space-y-1">
          <p><span className="font-mono">URL:</span> {process.env.SUPABASE_URL || window.location.origin}</p>
          <p><span className="font-mono">API Key:</span> {"************"}</p>
          <p><span className="font-mono">Timestamp:</span> {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
};

export default SupabaseConnectionDiagnostic;
