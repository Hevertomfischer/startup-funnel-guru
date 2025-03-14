
import { supabase, handleError } from './base-service';
import { toast } from 'sonner';
import type { Label } from '@/integrations/supabase/client';

export const getLabels = async (): Promise<Label[]> => {
  try {
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Failed to fetch labels');
    return [];
  }
};

export const createLabel = async (label: Omit<Label, 'id' | 'created_at'>): Promise<Label | null> => {
  try {
    const { data, error } = await supabase
      .from('labels')
      .insert(label)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Label created successfully');
    return data;
  } catch (error: any) {
    handleError(error, 'Failed to create label');
    return null;
  }
};

export const updateLabel = async (id: string, label: Partial<Label>): Promise<Label | null> => {
  try {
    const { data, error } = await supabase
      .from('labels')
      .update(label)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Label updated successfully');
    return data;
  } catch (error: any) {
    handleError(error, 'Failed to update label');
    return null;
  }
};

export const deleteLabel = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('labels')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Label deleted successfully');
    return true;
  } catch (error: any) {
    handleError(error, 'Failed to delete label');
    return false;
  }
};
