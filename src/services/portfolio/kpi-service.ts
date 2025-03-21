
import { supabase, handleError } from '@/services/base-service';
import { toast } from 'sonner';

/**
 * Get all KPIs for a specific startup
 */
export const getStartupKPIs = async (startupId: string) => {
  try {
    const { data, error } = await supabase
      .from('startup_kpis')
      .select(`
        *,
        attachments:attachments(*)
      `)
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
    // Extract attachments from the data
    const { attachments, ...kpiFields } = kpiData;
    
    const { data, error } = await supabase
      .from('startup_kpis')
      .insert(kpiFields)
      .select()
      .single();
    
    if (error) throw error;
    
    // Handle attachments if any
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      const attachmentPromises = attachments.map(attachment => {
        return supabase
          .from('attachments')
          .insert({
            startup_id: kpiFields.startup_id,
            name: attachment.name,
            url: attachment.url,
            type: attachment.type,
            size: attachment.size,
            related_id: data.id,
            related_type: 'kpi'
          });
      });
      
      await Promise.all(attachmentPromises);
    }
    
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
    // Extract attachments from the data
    const { attachments, ...kpiFields } = kpiData;
    
    const { data, error } = await supabase
      .from('startup_kpis')
      .update(kpiFields)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Handle attachments if provided - delete existing and add new ones
    if (attachments !== undefined) {
      // Delete existing attachments
      await supabase
        .from('attachments')
        .delete()
        .eq('related_id', id)
        .eq('related_type', 'kpi');
      
      // Add new attachments if any
      if (Array.isArray(attachments) && attachments.length > 0) {
        const attachmentPromises = attachments.map(attachment => {
          return supabase
            .from('attachments')
            .insert({
              startup_id: kpiFields.startup_id,
              name: attachment.name,
              url: attachment.url,
              type: attachment.type,
              size: attachment.size,
              related_id: id,
              related_type: 'kpi'
            });
        });
        
        await Promise.all(attachmentPromises);
      }
    }
    
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
    // First delete related attachments
    await supabase
      .from('attachments')
      .delete()
      .eq('related_id', id)
      .eq('related_type', 'kpi');
    
    // Then delete the KPI
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
