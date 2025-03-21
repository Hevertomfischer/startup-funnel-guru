
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
    // First create the board meeting
    const { data, error } = await supabase
      .from('board_meetings')
      .insert({
        title: meetingData.title,
        startup_id: meetingData.startup_id,
        meeting_date: meetingData.meeting_date,
        location: meetingData.location,
        description: meetingData.description,
        minutes: meetingData.minutes,
        decisions: meetingData.decisions
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Then, if there are attendees, add them
    if (meetingData.attendees && Array.isArray(meetingData.attendees) && meetingData.attendees.length > 0) {
      const attendeesData = meetingData.attendees.map((attendee: any) => ({
        board_meeting_id: data.id,
        member_name: attendee.member_name,
        member_email: attendee.member_email,
        member_role: attendee.member_role
      }));
      
      const { error: attendeesError } = await supabase
        .from('board_meeting_attendees')
        .insert(attendeesData);
      
      if (attendeesError) throw attendeesError;
    }
    
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
    // First update the board meeting
    const { data, error } = await supabase
      .from('board_meetings')
      .update({
        title: meetingData.title,
        meeting_date: meetingData.meeting_date,
        location: meetingData.location,
        description: meetingData.description,
        minutes: meetingData.minutes,
        decisions: meetingData.decisions
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Handle attendees - first delete existing attendees
    if (meetingData.attendees && Array.isArray(meetingData.attendees)) {
      const { error: deleteError } = await supabase
        .from('board_meeting_attendees')
        .delete()
        .eq('board_meeting_id', id);
      
      if (deleteError) throw deleteError;
      
      // Then add the new/updated attendees
      if (meetingData.attendees.length > 0) {
        const attendeesData = meetingData.attendees.map((attendee: any) => ({
          board_meeting_id: id,
          member_name: attendee.member_name,
          member_email: attendee.member_email,
          member_role: attendee.member_role
        }));
        
        const { error: attendeesError } = await supabase
          .from('board_meeting_attendees')
          .insert(attendeesData);
        
        if (attendeesError) throw attendeesError;
      }
    }
    
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
    // First delete related attendees
    const { error: attendeesError } = await supabase
      .from('board_meeting_attendees')
      .delete()
      .eq('board_meeting_id', id);
    
    if (attendeesError) throw attendeesError;
    
    // Then delete the board meeting
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
