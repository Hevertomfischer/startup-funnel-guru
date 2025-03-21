
import { supabase, handleError } from '@/services/base-service';
import { toast } from 'sonner';

/**
 * Get all KPIs for a specific startup
 */
export const getStartupKPIs = async (startupId: string) => {
  try {
    const { data, error } = await supabase
      .from('startup_kpis')
      .select('*')
      .eq('startup_id', startupId)
      .order('period', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Error fetching startup KPIs');
    return [];
  }
};

/**
 * Create a new KPI record for a startup
 */
export const createKPI = async (kpiData: any) => {
  try {
    const { data, error } = await supabase
      .from('startup_kpis')
      .insert(kpiData)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('KPI adicionado com sucesso');
    return data;
  } catch (error: any) {
    handleError(error, 'Erro ao criar KPI');
    return null;
  }
};

/**
 * Update an existing KPI record
 */
export const updateKPI = async (id: string, kpiData: any) => {
  try {
    const { data, error } = await supabase
      .from('startup_kpis')
      .update(kpiData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('KPI atualizado com sucesso');
    return data;
  } catch (error: any) {
    handleError(error, 'Erro ao atualizar KPI');
    return null;
  }
};

/**
 * Delete a KPI record
 */
export const deleteKPI = async (id: string) => {
  try {
    const { error } = await supabase
      .from('startup_kpis')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('KPI removido com sucesso');
    return true;
  } catch (error: any) {
    handleError(error, 'Erro ao excluir KPI');
    return false;
  }
};
