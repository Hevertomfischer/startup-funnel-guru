
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
        attendees:board_meeting_attendees(*),
        attachments:attachments(*)
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
    // Extract attachments and attendees
    const { attachments, attendees, ...meetingFields } = meetingData;
    
    // First create the board meeting
    const { data, error } = await supabase
      .from('board_meetings')
      .insert({
        title: meetingFields.title,
        startup_id: meetingFields.startup_id,
        meeting_date: meetingFields.meeting_date,
        location: meetingFields.location,
        description: meetingFields.description,
        minutes: meetingFields.minutes,
        decisions: meetingFields.decisions
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Then, if there are attendees, add them
    if (attendees && Array.isArray(attendees) && attendees.length > 0) {
      const attendeesData = attendees.map((attendee: any) => ({
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
    
    // Handle attachments if any
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      const attachmentPromises = attachments.map(attachment => {
        return supabase
          .from('attachments')
          .insert({
            startup_id: meetingFields.startup_id,
            name: attachment.name,
            url: attachment.url,
            type: attachment.type,
            size: attachment.size,
            related_id: data.id,
            related_type: 'board_meeting',
            is_pitch_deck: attachment.isPitchDeck || false
          });
      });
      
      await Promise.all(attachmentPromises);
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
    // Extract attachments and attendees
    const { attachments, attendees, ...meetingFields } = meetingData;
    
    // First update the board meeting
    const { data, error } = await supabase
      .from('board_meetings')
      .update({
        title: meetingFields.title,
        meeting_date: meetingFields.meeting_date,
        location: meetingFields.location,
        description: meetingFields.description,
        minutes: meetingFields.minutes,
        decisions: meetingFields.decisions
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Handle attendees - first delete existing attendees
    if (attendees && Array.isArray(attendees)) {
      const { error: deleteError } = await supabase
        .from('board_meeting_attendees')
        .delete()
        .eq('board_meeting_id', id);
      
      if (deleteError) throw deleteError;
      
      // Then add the new/updated attendees
      if (attendees.length > 0) {
        const attendeesData = attendees.map((attendee: any) => ({
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
    
    // Handle attachments if provided - delete existing and add new ones
    if (attachments !== undefined) {
      // Delete existing attachments
      await supabase
        .from('attachments')
        .delete()
        .eq('related_id', id)
        .eq('related_type', 'board_meeting');
      
      // Add new attachments if any
      if (Array.isArray(attachments) && attachments.length > 0) {
        const startup_id = data.startup_id;
        const attachmentPromises = attachments.map(attachment => {
          return supabase
            .from('attachments')
            .insert({
              startup_id,
              name: attachment.name,
              url: attachment.url,
              type: attachment.type,
              size: attachment.size,
              related_id: id,
              related_type: 'board_meeting',
              is_pitch_deck: attachment.isPitchDeck || false
            });
        });
        
        await Promise.all(attachmentPromises);
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
    
    // Delete related attachments
    await supabase
      .from('attachments')
      .delete()
      .eq('related_id', id)
      .eq('related_type', 'board_meeting');
    
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
