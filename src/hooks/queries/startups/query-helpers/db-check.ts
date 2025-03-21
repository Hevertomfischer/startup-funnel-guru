
import { supabase } from '@/integrations/supabase/client';

/**
 * Verifies the existence of database tables
 */
export const checkDatabaseTables = async () => {
  try {
    console.log('Verificando a existência de tabelas no banco de dados');
    
    // Lista de tabelas essenciais para verificar
    const essentialTables = ['statuses', 'startups', 'team_members', 'attachments'] as const;
    const results: Record<string, boolean> = {};
    
    for (const table of essentialTables) {
      try {
        console.log(`Verificando tabela ${table}...`);
        const { error } = await supabase.from(table).select('count');
        
        if (error) {
          console.error(`Erro ao verificar tabela ${table}:`, error);
          results[table] = false;
        } else {
          console.log(`Tabela ${table} existe e está acessível`);
          results[table] = true;
        }
      } catch (e) {
        console.error(`Erro ao verificar tabela ${table}:`, e);
        results[table] = false;
      }
    }
    
    return {
      allTablesExist: Object.values(results).every(exists => exists),
      tables: results
    };
  } catch (e) {
    console.error('Erro ao verificar tabelas do banco:', e);
    return {
      allTablesExist: false,
      tables: {},
      error: e instanceof Error ? e.message : String(e)
    };
  }
};
