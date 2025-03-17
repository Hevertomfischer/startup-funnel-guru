
import { supabase, handleError } from '../base-service';
import { toast } from 'sonner';

/**
 * Deletes a startup from the database
 * @param id The ID of the startup to delete
 * @returns A promise resolving to a boolean indicating success or failure
 */
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
