import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, PencilIcon, Trash2Icon, CalendarIcon, MapPin, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createBoardMeeting, updateBoardMeeting, deleteBoardMeeting } from '@/services/portfolio';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AttachmentUploader } from '@/components/shared/AttachmentUploader';

const boardMeetingFormSchema = z.object({
  startup_id: z.string(),
  title: z.string().min(1, 'O título é obrigatório'),
  meeting_date: z.string().min(1, 'A data é obrigatória'),
  location: z.string().optional(),
  description: z.string().optional(),
  minutes: z.string().optional(),
  decisions: z.string().optional(),
  attendees: z.array(
    z.object({
      member_name: z.string().min(1, 'O nome é obrigatório'),
      member_email: z.string().email('Email inválido').optional().or(z.literal('')),
      member_role: z.string().optional()
    })
  ).optional(),
  attachments: z.array(
    z.object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
      url: z.string()
    })
  ).optional(),
});

type BoardMeetingFormValues = z.infer<typeof boardMeetingFormSchema>;

interface PortfolioBoardMeetingsSectionProps {
  startupId: string;
  portfolio: any;
}

const PortfolioBoardMeetingsSection: React.FC<PortfolioBoardMeetingsSectionProps> = ({ startupId, portfolio }) => {
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
    
    // Prepare attendees for form
    const attendeesData = meeting.attendees && meeting.attendees.length > 0
      ? meeting.attendees.map((a: any) => ({
          member_name: a.member_name || '',
          member_email: a.member_email || '',
          member_role: a.member_role || ''
        }))
      : [{ member_name: '', member_email: '', member_role: '' }];
    
    form.reset({
      startup_id: startupId,
      title: meeting.title || '',
      meeting_date: meeting.meeting_date || format(new Date(), 'yyyy-MM-dd'),
      location: meeting.location || '',
      description: meeting.description || '',
      minutes: meeting.minutes || '',
      decisions: meeting.decisions || '',
      attendees: attendeesData,
      attachments: meeting.attachments || []
    });
    setOpenDialog(true);
  };
  
  const onSubmit = async (values: BoardMeetingFormValues) => {
    try {
      // Filter out empty attendees
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
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PP', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  // Function to add a new attendee field
  const addAttendee = () => {
    const currentAttendees = form.getValues('attendees') || [];
    form.setValue('attendees', [...currentAttendees, { member_name: '', member_email: '', member_role: '' }]);
  };
  
  // Function to remove an attendee field
  const removeAttendee = (index: number) => {
    const currentAttendees = form.getValues('attendees') || [];
    if (currentAttendees.length <= 1) return; // Keep at least one attendee field
    
    form.setValue('attendees', currentAttendees.filter((_, i) => i !== index));
  };
  
  if (isLoadingMeetings) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Reuniões de Conselho</h3>
        <Button onClick={openNewMeetingDialog} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Agendar Reunião
        </Button>
      </div>
      
      {boardMeetings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma reunião registrada para esta startup</p>
          <Button variant="outline" className="mt-4" onClick={openNewMeetingDialog}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Agendar Primeira Reunião
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {boardMeetings.map((meeting: any) => (
              <Card key={meeting.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium">{meeting.title}</h4>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{formatDate(meeting.meeting_date)}</span>
                        </div>
                        
                        {meeting.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{meeting.location}</span>
                          </div>
                        )}
                        
                        {meeting.attendees && meeting.attendees.length > 0 && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{meeting.attendees.length} participante(s)</span>
                          </div>
                        )}
                      </div>
                      
                      {meeting.description && (
                        <p className="text-sm line-clamp-2">{meeting.description}</p>
                      )}
                      
                      {meeting.decisions && (
                        <div>
                          <h5 className="text-sm font-medium mt-2">Decisões:</h5>
                          <p className="text-sm text-muted-foreground line-clamp-2">{meeting.decisions}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1 ml-4">
                      <Button variant="ghost" size="icon" onClick={() => openEditMeetingDialog(meeting)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteMeeting(meeting.id)}>
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {/* Board Meeting Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Reunião' : 'Agendar Nova Reunião'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="meeting_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                formatDate(field.value)
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? parseISO(field.value) : undefined}
                            onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Presencial ou link de reunião virtual" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Participantes</h4>
                <div className="space-y-3">
                  {form.watch('attendees')?.map((_, index) => (
                    <div key={index} className="flex space-x-2 items-start">
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <FormField
                          control={form.control}
                          name={`attendees.${index}.member_name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Nome" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`attendees.${index}.member_email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Email" type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`attendees.${index}.member_role`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Função" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => removeAttendee(index)}
                        disabled={form.watch('attendees')?.length <= 1}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addAttendee}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Adicionar Participante
                  </Button>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ata da Reunião</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} placeholder="Registre os pontos discutidos na reunião" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="decisions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decisões e Próximos Passos</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} placeholder="Registre as decisões tomadas e próximos passos definidos" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <AttachmentUploader
                    attachments={field.value || []}
                    onChange={(attachments) => form.setValue('attachments', attachments)}
                    label="Documentos da Reunião"
                    folderPath={`board-meetings/${startupId}`}
                  />
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {isEditing ? 'Atualizar' : 'Agendar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioBoardMeetingsSection;
