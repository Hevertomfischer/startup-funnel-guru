
import { supabase, handleError } from './base-service';
import { toast } from 'sonner';
import type { Attachment } from '@/types/index';

export const getStartupAttachments = async (startupId: string): Promise<Attachment[]> => {
  try {
    console.log('Fetching attachments for startup:', startupId);
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('startup_id', startupId)
      .order('uploaded_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching attachments:', error);
      throw error;
    }
    
    console.log('Fetched attachments:', data);
    
    // Map the data to match the Attachment interface
    return data?.map(item => ({
      id: item.id,
      name: item.name,
      url: item.url,
      type: item.type,
      size: item.size || 0,
      uploadedAt: item.uploaded_at,
      startup_id: item.startup_id,
      related_id: item.related_id,
      related_type: item.related_type as 'kpi' | 'board_meeting' | 'startup' | undefined
    })) || [];
  } catch (error: any) {
    handleError(error, 'Error fetching startup attachments');
    return [];
  }
};

export const addAttachment = async (attachment: {
  startup_id?: string;
  type: string;
  name: string;
  url: string;
  size?: number;
  related_id?: string;
  related_type?: string;
}): Promise<Attachment | null> => {
  try {
    console.log('Adding attachment:', attachment);
    const { data, error } = await supabase
      .from('attachments')
      .insert(attachment)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding attachment:', error);
      throw error;
    }
    
    console.log('Attachment added successfully:', data);
    
    // Transform to match Attachment interface
    return data ? {
      id: data.id,
      name: data.name,
      url: data.url,
      type: data.type,
      size: data.size || 0,
      uploadedAt: data.uploaded_at,
      startup_id: data.startup_id,
      related_id: data.related_id,
      related_type: data.related_type as 'kpi' | 'board_meeting' | 'startup' | undefined
    } : null;
  } catch (error: any) {
    console.error('Error in addAttachment:', error);
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
    
    // Map the data to match the Attachment interface
    return data?.map(item => ({
      id: item.id,
      name: item.name,
      url: item.url,
      type: item.type,
      size: item.size || 0,
      uploadedAt: item.uploaded_at,
      startup_id: item.startup_id,
      related_id: item.related_id,
      related_type: item.related_type as 'kpi' | 'board_meeting' | 'startup' | undefined
    })) || [];
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
    
    // Map the data to match the Attachment interface
    return data?.map(item => ({
      id: item.id,
      name: item.name,
      url: item.url,
      type: item.type,
      size: item.size || 0,
      uploadedAt: item.uploaded_at,
      startup_id: item.startup_id,
      related_id: item.related_id,
      related_type: item.related_type as 'kpi' | 'board_meeting' | 'startup' | undefined
    })) || [];
  } catch (error: any) {
    handleError(error, 'Error fetching board meeting attachments');
    return [];
  }
};
