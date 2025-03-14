
import { supabase, handleError } from './base-service';
import { toast } from 'sonner';

export const getStatuses = async () => {
  try {
    const { data, error } = await supabase
      .from('statuses')
      .select('*')
      .order('position');
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Error fetching statuses');
    return [];
  }
};

export const createStatus = async (status: any) => {
  try {
    const { data, error } = await supabase
      .from('statuses')
      .insert(status)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Status created', {
      description: `Status "${status.name}" has been created`
    });
    
    return data;
  } catch (error: any) {
    handleError(error, 'Error creating status');
    return null;
  }
};

export const updateStatus = async (id: string, status: any) => {
  try {
    const { data, error } = await supabase
      .from('statuses')
      .update(status)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Status updated', {
      description: `Status "${status.name}" has been updated`
    });
    
    return data;
  } catch (error: any) {
    handleError(error, 'Error updating status');
    return null;
  }
};

export const deleteStatus = async (id: string) => {
  try {
    const { error } = await supabase
      .from('statuses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Status deleted', {
      description: 'The status has been deleted'
    });
    
    return true;
  } catch (error: any) {
    handleError(error, 'Error deleting status');
    return false;
  }
};

export const updateStatusPositions = async (statusPositions: { id: string, position: number }[]) => {
  try {
    // Use Promise.all to update all statuses in parallel
    const updates = statusPositions.map(({ id, position }) => 
      supabase
        .from('statuses')
        .update({ position })
        .eq('id', id)
    );
    
    const results = await Promise.all(updates);
    
    // Check if any updates had errors
    const hasErrors = results.some(result => result.error);
    
    if (hasErrors) {
      throw new Error('One or more status position updates failed');
    }
    
    return true;
  } catch (error: any) {
    handleError(error, 'Error updating status positions');
    return false;
  }
};
