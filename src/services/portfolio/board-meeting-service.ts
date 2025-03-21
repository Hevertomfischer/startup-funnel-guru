
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
    // Extract attendees from meeting data to insert separately
    const { attendees, ...meetingRecord } = meetingData;
    
    // Insert the meeting record
    const { data, error } = await supabase
      .from('board_meetings')
      .insert(meetingRecord)
      .select()
      .single();
    
    if (error) throw error;
    
    // If meeting created successfully and we have attendees
    if (data && attendees && attendees.length > 0) {
      // Prepare attendees records
      const attendeesRecords = attendees.map((attendee: any) => ({
        board_meeting_id: data.id,
        member_name: attendee.name,
        member_email: attendee.email,
        member_role: attendee.role,
      }));
      
      // Insert attendees
      const { error: attendeesError } = await supabase
        .from('board_meeting_attendees')
        .insert(attendeesRecords);
      
      if (attendeesError) {
        console.error('Error adding attendees:', attendeesError);
        toast.error('Reunião criada, mas houve um erro ao adicionar participantes');
      }
    }
    
    toast.success('Reunião do conselho adicionada com sucesso');
    return data;
  } catch (error: any) {
    handleError(error, 'Erro ao criar reunião do conselho');
    return null;
  }
};

/**
 * Update an existing board meeting record
 */
export const updateBoardMeeting = async (id: string, meetingData: any) => {
  try {
    // Extract attendees from meeting data to update separately
    const { attendees, ...meetingRecord } = meetingData;
    
    // Update the meeting record
    const { data, error } = await supabase
      .from('board_meetings')
      .update(meetingRecord)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // If we have attendees, update them
    if (attendees) {
      // First delete all existing attendees
      const { error: deleteError } = await supabase
        .from('board_meeting_attendees')
        .delete()
        .eq('board_meeting_id', id);
      
      if (deleteError) {
        console.error('Error removing existing attendees:', deleteError);
      }
      
      // Then insert new attendees if we have any
      if (attendees.length > 0) {
        const attendeesRecords = attendees.map((attendee: any) => ({
          board_meeting_id: id,
          member_name: attendee.name,
          member_email: attendee.email,
          member_role: attendee.role,
        }));
        
        const { error: insertError } = await supabase
          .from('board_meeting_attendees')
          .insert(attendeesRecords);
        
        if (insertError) {
          console.error('Error adding new attendees:', insertError);
          toast.error('Reunião atualizada, mas houve um erro ao atualizar participantes');
        }
      }
    }
    
    toast.success('Reunião do conselho atualizada com sucesso');
    return data;
  } catch (error: any) {
    handleError(error, 'Erro ao atualizar reunião do conselho');
    return null;
  }
};

/**
 * Delete a board meeting record
 */
export const deleteBoardMeeting = async (id: string) => {
  try {
    // First delete all attendees
    const { error: attendeesError } = await supabase
      .from('board_meeting_attendees')
      .delete()
      .eq('board_meeting_id', id);
    
    if (attendeesError) {
      console.error('Error deleting attendees:', attendeesError);
    }
    
    // Then delete the meeting
    const { error } = await supabase
      .from('board_meetings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Reunião do conselho removida com sucesso');
    return true;
  } catch (error: any) {
    handleError(error, 'Erro ao excluir reunião do conselho');
    return false;
  }
};
