
import { supabase, handleError } from './base-service';
import { toast } from 'sonner';
import type { Startup } from '@/integrations/supabase/client';

export const getStartups = async (): Promise<Startup[]> => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Failed to fetch startups');
    return [];
  }
};

export const getStartupsByStatus = async (statusId: string): Promise<Startup[]> => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('status_id', statusId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Failed to fetch startups by status');
    return [];
  }
};

export const getStartup = async (id: string): Promise<Startup | null> => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    handleError(error, 'Failed to fetch startup');
    return null;
  }
};

export const createStartup = async (startup: Omit<Startup, 'id' | 'created_at' | 'updated_at'>): Promise<Startup | null> => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .insert(startup)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Startup created successfully');
    return data;
  } catch (error: any) {
    handleError(error, 'Failed to create startup');
    return null;
  }
};

export const updateStartup = async (id: string, startup: Partial<Startup>): Promise<Startup | null> => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .update(startup)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Startup updated successfully');
    return data;
  } catch (error: any) {
    handleError(error, 'Failed to update startup');
    return null;
  }
};

export const deleteStartup = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('startups')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Startup deleted successfully');
    return true;
  } catch (error: any) {
    handleError(error, 'Failed to delete startup');
    return false;
  }
};
