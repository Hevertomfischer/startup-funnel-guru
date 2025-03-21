
import { supabase, handleError } from '@/services/base-service';
import { toast } from 'sonner';

/**
 * Get all portfolio highlights for a specific startup
 */
export const getStartupHighlights = async (startupId: string) => {
  try {
    const { data, error } = await supabase
      .from('portfolio_highlights')
      .select('*')
      .eq('startup_id', startupId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Error fetching startup highlights');
    return [];
  }
};

/**
 * Create a new portfolio highlight record
 */
export const createHighlight = async (highlightData: any) => {
  try {
    const { data, error } = await supabase
      .from('portfolio_highlights')
      .insert(highlightData)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Destaque adicionado com sucesso');
    return data;
  } catch (error: any) {
    handleError(error, 'Erro ao criar destaque');
    return null;
  }
};

/**
 * Update an existing portfolio highlight record
 */
export const updateHighlight = async (id: string, highlightData: any) => {
  try {
    const { data, error } = await supabase
      .from('portfolio_highlights')
      .update(highlightData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Destaque atualizado com sucesso');
    return data;
  } catch (error: any) {
    handleError(error, 'Erro ao atualizar destaque');
    return null;
  }
};

/**
 * Delete a portfolio highlight record
 */
export const deleteHighlight = async (id: string) => {
  try {
    const { error } = await supabase
      .from('portfolio_highlights')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Destaque removido com sucesso');
    return true;
  } catch (error: any) {
    handleError(error, 'Erro ao excluir destaque');
    return false;
  }
};
