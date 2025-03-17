
import { supabase, handleError } from './base-service';
import { toast } from 'sonner';
import type { Startup } from '@/integrations/supabase/client';
import { addAttachment } from './attachment-service';

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
    console.log(`Fetching startups for status: ${statusId}`);
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('status_id', statusId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    console.log(`Retrieved ${data?.length || 0} startups for status ${statusId}`);
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

export const createStartup = async (startup: Omit<Startup, 'id' | 'created_at' | 'updated_at'> & { attachments?: any[] }): Promise<Startup | null> => {
  try {
    console.log('Creating startup in Supabase with data:', startup);
    const { attachments, ...startupData } = startup;
    
    // Process numeric fields and ensure they're valid numbers or null
    const preparedData = {
      ...startupData,
      mrr: startupData.mrr !== undefined ? 
           (typeof startupData.mrr === 'string' ? 
             (startupData.mrr === '' ? null : Number(startupData.mrr)) : 
             startupData.mrr) : null,
      client_count: startupData.client_count !== undefined ? 
                   (typeof startupData.client_count === 'string' ? 
                     (startupData.client_count === '' ? null : Number(startupData.client_count)) : 
                     startupData.client_count) : null
    };
    
    console.log('Prepared data for Supabase insert:', preparedData);
    
    const { data, error } = await supabase
      .from('startups')
      .insert(preparedData)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    
    console.log('Startup created in Supabase:', data);
    
    if (attachments && attachments.length > 0) {
      for (const file of attachments) {
        await addAttachment({
          startup_id: data.id,
          name: file.name,
          type: file.type,
          size: file.size,
          url: file.url
        });
      }
    }
    
    toast.success('Startup created successfully');
    return data;
  } catch (error: any) {
    console.error('Error in createStartup function:', error);
    handleError(error, 'Failed to create startup');
    return null;
  }
};

export const updateStartup = async (id: string, startup: Partial<Startup> & { attachments?: any[] }): Promise<Startup | null> => {
  try {
    console.log('Updating startup in Supabase with id:', id, 'and data:', startup);
    const { attachments, ...startupData } = startup;
    
    // Process numeric fields and ensure they're valid numbers or null
    const preparedData = {
      ...startupData,
      mrr: startupData.mrr !== undefined ? 
           (typeof startupData.mrr === 'string' ? 
             (startupData.mrr === '' ? null : Number(startupData.mrr)) : 
             startupData.mrr) : null,
      client_count: startupData.client_count !== undefined ? 
                   (typeof startupData.client_count === 'string' ? 
                     (startupData.client_count === '' ? null : Number(startupData.client_count)) : 
                     startupData.client_count) : null
    };
    
    console.log('Prepared data for Supabase update:', preparedData);
    
    const { data, error } = await supabase
      .from('startups')
      .update(preparedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    
    console.log('Startup updated in Supabase:', data);
    
    if (attachments && attachments.length > 0) {
      for (const file of attachments) {
        if (!file.id) {
          await addAttachment({
            startup_id: id,
            name: file.name,
            type: file.type,
            size: file.size,
            url: file.url
          });
        }
      }
    }
    
    toast.success('Startup updated successfully');
    return data;
  } catch (error: any) {
    console.error('Error in updateStartup function:', error);
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
