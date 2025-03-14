
import { supabase, handleError } from './base-service';

export const getStartupLabels = async (startupId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('startups_labels')
      .select('label_id')
      .eq('startup_id', startupId);
    
    if (error) throw error;
    return data?.map(item => item.label_id) || [];
  } catch (error: any) {
    handleError(error, 'Error fetching startup labels');
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
    handleError(error, 'Error adding label to startup');
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
    handleError(error, 'Error removing label from startup');
    return false;
  }
};
