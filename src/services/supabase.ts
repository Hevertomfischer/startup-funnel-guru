
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { 
  Startup, 
  Status, 
  Label, 
  User, 
  Attachment, 
  StartupField 
} from '@/integrations/supabase/client';

// Status services
export const getStatuses = async (): Promise<Status[]> => {
  try {
    const { data, error } = await supabase
      .from('statuses')
      .select('*')
      .order('position');
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast.error('Failed to fetch statuses', {
      description: error.message
    });
    console.error('Error fetching statuses:', error);
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
    toast.error('Failed to create status', {
      description: error.message
    });
    console.error('Error creating status:', error);
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
    toast.error('Failed to update status', {
      description: error.message
    });
    console.error('Error updating status:', error);
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
    toast.error('Failed to update status positions', {
      description: error.message
    });
    console.error('Error updating status positions:', error);
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
    toast.error('Failed to delete status', {
      description: error.message
    });
    console.error('Error deleting status:', error);
    return false;
  }
};

// Label services
export const getLabels = async (): Promise<Label[]> => {
  try {
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast.error('Failed to fetch labels', {
      description: error.message
    });
    console.error('Error fetching labels:', error);
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
    toast.error('Failed to create label', {
      description: error.message
    });
    console.error('Error creating label:', error);
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
    toast.error('Failed to update label', {
      description: error.message
    });
    console.error('Error updating label:', error);
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
    toast.error('Failed to delete label', {
      description: error.message
    });
    console.error('Error deleting label:', error);
    return false;
  }
};

// Startup services
export const getStartups = async (): Promise<Startup[]> => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast.error('Failed to fetch startups', {
      description: error.message
    });
    console.error('Error fetching startups:', error);
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
    toast.error('Failed to fetch startups by status', {
      description: error.message
    });
    console.error('Error fetching startups by status:', error);
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
    toast.error('Failed to fetch startup', {
      description: error.message
    });
    console.error('Error fetching startup:', error);
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
    toast.error('Failed to create startup', {
      description: error.message
    });
    console.error('Error creating startup:', error);
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
    toast.error('Failed to update startup', {
      description: error.message
    });
    console.error('Error updating startup:', error);
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
    toast.error('Failed to delete startup', {
      description: error.message
    });
    console.error('Error deleting startup:', error);
    return false;
  }
};

// Startup Labels services
export const getStartupLabels = async (startupId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('startups_labels')
      .select('label_id')
      .eq('startup_id', startupId);
    
    if (error) throw error;
    return data?.map(item => item.label_id) || [];
  } catch (error: any) {
    console.error('Error fetching startup labels:', error);
    return [];
  }
};

export const addLabelToStartup = async (startupId: string, labelId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('startups_labels')
      .insert({ startup_id: startupId, label_id: labelId });
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error adding label to startup:', error);
    return false;
  }
};

export const removeLabelFromStartup = async (startupId: string, labelId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('startups_labels')
      .delete()
      .eq('startup_id', startupId)
      .eq('label_id', labelId);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error removing label from startup:', error);
    return false;
  }
};

// Attachments services
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
    console.error('Error fetching startup attachments:', error);
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
    console.error('Error adding attachment:', error);
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
    console.error('Error deleting attachment:', error);
    return false;
  }
};

// Custom fields services
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
    console.error('Error fetching startup fields:', error);
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
    console.error('Error adding startup field:', error);
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
    console.error('Error updating startup field:', error);
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
    console.error('Error deleting startup field:', error);
    return false;
  }
};
