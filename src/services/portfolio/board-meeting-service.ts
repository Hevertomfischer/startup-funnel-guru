
import { supabase, handleError } from '@/services/base-service';
import { toast } from 'sonner';

/**
 * Get all board meetings for a specific startup
 */
export const getStartupBoardMeetings = async (startupId: string) => {
  try {
    const { data, error } = await supabase
      .from('board_meetings')
      .select(`
        *,
        attendees:board_meeting_attendees(*)
      `)
      .eq('startup_id', startupId)
      .order('meeting_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Error fetching board meetings');
    return [];
  }
};

/**
 * Create a new board meeting record
 */
export const createBoardMeeting = async (meetingData: any) => {
  try {
    const { data, error } = await supabase
      .from('board_meetings')
      .insert(meetingData)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Reunião agendada com sucesso');
    return data;
  } catch (error: any) {
    handleError(error, 'Erro ao criar reunião');
    return null;
  }
};

/**
 * Update an existing board meeting record
 */
export const updateBoardMeeting = async (id: string, meetingData: any) => {
  try {
    const { data, error } = await supabase
      .from('board_meetings')
      .update(meetingData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Reunião atualizada com sucesso');
    return data;
  } catch (error: any) {
    handleError(error, 'Erro ao atualizar reunião');
    return null;
  }
};

/**
 * Delete a board meeting record
 */
export const deleteBoardMeeting = async (id: string) => {
  try {
    const { error } = await supabase
      .from('board_meetings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Reunião removida com sucesso');
    return true;
  } catch (error: any) {
    handleError(error, 'Erro ao excluir reunião');
    return false;
  }
};

/**
 * Add attendee to a board meeting
 */
export const addBoardMeetingAttendee = async (attendeeData: any) => {
  try {
    const { data, error } = await supabase
      .from('board_meeting_attendees')
      .insert(attendeeData)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    handleError(error, 'Erro ao adicionar participante');
    return null;
  }
};

/**
 * Remove attendee from a board meeting
 */
export const removeBoardMeetingAttendee = async (attendeeId: string) => {
  try {
    const { error } = await supabase
      .from('board_meeting_attendees')
      .delete()
      .eq('id', attendeeId);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    handleError(error, 'Erro ao remover participante');
    return false;
  }
};
