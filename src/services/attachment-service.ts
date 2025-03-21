
import { supabase, handleError } from './base-service';
import type { Attachment } from '@/integrations/supabase/client';

export const getStartupAttachments = async (startupId: string): Promise<Attachment[]> => {
  try {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('startup_id', startupId)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Error fetching startup attachments');
    return [];
  }
};

export const addAttachment = async (attachment: Omit<Attachment, 'id' | 'uploaded_at'>): Promise<Attachment | null> => {
  try {
    const { data, error } = await supabase
      .from('attachments')
      .insert(attachment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    handleError(error, 'Error adding attachment');
    return null;
  }
};

export const deleteAttachment = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('attachments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    handleError(error, 'Error deleting attachment');
    return false;
  }
};

// Get attachments for specific related entities
export const getKPIAttachments = async (kpiId: string): Promise<Attachment[]> => {
  try {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('related_id', kpiId)
      .eq('related_type', 'kpi')
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Error fetching KPI attachments');
    return [];
  }
};

export const getBoardMeetingAttachments = async (meetingId: string): Promise<Attachment[]> => {
  try {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('related_id', meetingId)
      .eq('related_type', 'board_meeting')
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Error fetching board meeting attachments');
    return [];
  }
};
