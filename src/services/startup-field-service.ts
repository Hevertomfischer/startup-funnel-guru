
import { supabase, handleError } from './base-service';
import type { StartupField } from '@/integrations/supabase/client';

export const getStartupFields = async (startupId: string): Promise<StartupField[]> => {
  try {
    const { data, error } = await supabase
      .from('startup_fields')
      .select('*')
      .eq('startup_id', startupId)
      .order('field_name');
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Error fetching startup fields');
    return [];
  }
};

export const addStartupField = async (field: Omit<StartupField, 'id' | 'created_at' | 'updated_at'>): Promise<StartupField | null> => {
  try {
    const { data, error } = await supabase
      .from('startup_fields')
      .insert(field)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    handleError(error, 'Error adding startup field');
    return null;
  }
};

export const updateStartupField = async (id: string, field: Partial<StartupField>): Promise<StartupField | null> => {
  try {
    const { data, error } = await supabase
      .from('startup_fields')
      .update(field)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    handleError(error, 'Error updating startup field');
    return null;
  }
};

export const deleteStartupField = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('startup_fields')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    handleError(error, 'Error deleting startup field');
    return false;
  }
};
