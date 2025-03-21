
import { supabase, handleError } from '@/services/base-service';
import { toast } from 'sonner';

/**
 * Get all strategic needs for a specific startup
 */
export const getStartupStrategicNeeds = async (startupId: string) => {
  try {
    const { data, error } = await supabase
      .from('strategic_needs')
      .select('*')
      .eq('startup_id', startupId)
      .order('priority', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Error fetching strategic needs');
    return [];
  }
};

/**
 * Create a new strategic need record
 */
export const createStrategicNeed = async (needData: any) => {
  try {
    const { data, error } = await supabase
      .from('strategic_needs')
      .insert(needData)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Necessidade estratégica adicionada com sucesso');
    return data;
  } catch (error: any) {
    handleError(error, 'Erro ao criar necessidade estratégica');
    return null;
  }
};

/**
 * Update an existing strategic need record
 */
export const updateStrategicNeed = async (id: string, needData: any) => {
  try {
    const { data, error } = await supabase
      .from('strategic_needs')
      .update(needData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Necessidade estratégica atualizada com sucesso');
    return data;
  } catch (error: any) {
    handleError(error, 'Erro ao atualizar necessidade estratégica');
    return null;
  }
};

/**
 * Delete a strategic need record
 */
export const deleteStrategicNeed = async (id: string) => {
  try {
    const { error } = await supabase
      .from('strategic_needs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Necessidade estratégica removida com sucesso');
    return true;
  } catch (error: any) {
    handleError(error, 'Erro ao excluir necessidade estratégica');
    return false;
  }
};
