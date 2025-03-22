
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { boardMeetingFormSchema, BoardMeetingFormValues } from './schema';
import { createBoardMeeting, updateBoardMeeting, deleteBoardMeeting } from '@/services/portfolio';

export function useBoardMeetings(startupId: string, portfolio: any) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  
  const { boardMeetings, isLoadingMeetings, refetchMeetings } = portfolio;
  
  const form = useForm<BoardMeetingFormValues>({
    resolver: zodResolver(boardMeetingFormSchema),
    defaultValues: {
      startup_id: startupId,
      title: '',
      meeting_date: format(new Date(), 'yyyy-MM-dd'),
      location: '',
      description: '',
      minutes: '',
      decisions: '',
      attendees: [{ member_name: '', member_email: '', member_role: '' }],
      attachments: [],
    },
  });
  
  const openNewMeetingDialog = () => {
    form.reset({
      startup_id: startupId,
      title: '',
      meeting_date: format(new Date(), 'yyyy-MM-dd'),
      location: '',
      description: '',
      minutes: '',
      decisions: '',
      attendees: [{ member_name: '', member_email: '', member_role: '' }],
      attachments: [],
    });
    setIsEditing(false);
    setSelectedMeeting(null);
    setOpenDialog(true);
  };
  
  const openEditMeetingDialog = (meeting: any) => {
    setSelectedMeeting(meeting);
    setIsEditing(true);
    
    const attendeesData = meeting.attendees && meeting.attendees.length > 0
      ? meeting.attendees.map((a: any) => ({
          member_name: a.member_name || '',
          member_email: a.member_email || '',
          member_role: a.member_role || ''
        }))
      : [{ member_name: '', member_email: '', member_role: '' }];
    
    const attachmentsData = meeting.attachments && meeting.attachments.length > 0
      ? meeting.attachments.map((a: any) => ({
          name: a.name || '',
          size: a.size || 0,
          type: a.type || '',
          url: a.url || ''
        }))
      : [];
    
    form.reset({
      startup_id: startupId,
      title: meeting.title || '',
      meeting_date: meeting.meeting_date || format(new Date(), 'yyyy-MM-dd'),
      location: meeting.location || '',
      description: meeting.description || '',
      minutes: meeting.minutes || '',
      decisions: meeting.decisions || '',
      attendees: attendeesData,
      attachments: attachmentsData
    });
    setOpenDialog(true);
  };
  
  const onSubmit = async (values: BoardMeetingFormValues) => {
    try {
      const filteredAttendees = values.attendees?.filter(a => a.member_name.trim() !== '') || [];
      
      const meetingData = {
        ...values,
        attendees: filteredAttendees
      };
      
      if (isEditing && selectedMeeting) {
        await updateBoardMeeting(selectedMeeting.id, meetingData);
      } else {
        await createBoardMeeting(meetingData);
      }
      
      refetchMeetings();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving board meeting:', error);
      toast.error('Erro ao salvar reunião');
    }
  };
  
  const handleDeleteMeeting = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta reunião?')) {
      try {
        await deleteBoardMeeting(id);
        refetchMeetings();
      } catch (error) {
        console.error('Error deleting board meeting:', error);
        toast.error('Erro ao excluir reunião');
      }
    }
  };

  return {
    form,
    openDialog,
    setOpenDialog,
    isEditing,
    selectedMeeting,
    boardMeetings,
    isLoadingMeetings,
    openNewMeetingDialog,
    openEditMeetingDialog,
    onSubmit,
    handleDeleteMeeting
  };
}
