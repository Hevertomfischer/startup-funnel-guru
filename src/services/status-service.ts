
import { supabase, handleError } from './base-service';
import { toast } from 'sonner';
import type { Status } from '@/integrations/supabase/client';

export const getStatuses = async (): Promise<Status[]> => {
  try {
    const { data, error } = await supabase
      .from('statuses')
      .select('*')
      .order('position');
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Failed to fetch statuses');
    return [];
  }
};

export const createStatus = async (status: Omit<Status, 'id' | 'created_at'>): Promise<Status | null> => {
  try {
    // Get the highest position value to place new status at the end
    const { data: lastStatus, error: posError } = await supabase
      .from('statuses')
      .select('position')
      .order('position', { ascending: false })
      .limit(1);
      
    const newPosition = (lastStatus && lastStatus.length > 0) ? lastStatus[0].position + 1 : 0;
    
    const { data, error } = await supabase
      .from('statuses')
      .insert({ ...status, position: newPosition })
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Status created successfully');
    return data;
  } catch (error: any) {
    handleError(error, 'Failed to create status');
    return null;
  }
};

export const updateStatus = async (id: string, status: Partial<Status>): Promise<Status | null> => {
  try {
    const { data, error } = await supabase
      .from('statuses')
      .update(status)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Status updated successfully');
    return data;
  } catch (error: any) {
    handleError(error, 'Failed to update status');
    return null;
  }
};

export const updateStatusPositions = async (statusPositions: { id: string, position: number }[]): Promise<boolean> => {
  try {
    // Use Promise.all to update all statuses concurrently
    await Promise.all(
      statusPositions.map(({ id, position }) => 
        supabase
          .from('statuses')
          .update({ position })
          .eq('id', id)
      )
    );
    
    return true;
  } catch (error: any) {
    handleError(error, 'Failed to update status positions');
    return false;
  }
};

export const deleteStatus = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('statuses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Status deleted successfully');
    return true;
  } catch (error: any) {
    handleError(error, 'Failed to delete status');
    return false;
  }
};
