
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, PlusCircle, Clock, PencilIcon, Trash2Icon, Users, FileText, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createBoardMeeting, updateBoardMeeting, deleteBoardMeeting } from '@/services/portfolio';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

const boardMeetingFormSchema = z.object({
  startup_id: z.string(),
  meeting_date: z.string().min(1, 'A data da reunião é obrigatória'),
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  location: z.string().optional(),
  minutes: z.string().optional(),
  decisions: z.string().optional(),
  attendees: z.array(
    z.object({
      name: z.string().min(1, 'Nome é obrigatório'),
      email: z.string().email('Email inválido').optional().or(z.literal('')),
      role: z.string().optional(),
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
  const [viewingMeeting, setViewingMeeting] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const { boardMeetings, isLoadingMeetings, refetchMeetings } = portfolio;
  
  const form = useForm<BoardMeetingFormValues>({
    resolver: zodResolver(boardMeetingFormSchema),
    defaultValues: {
      startup_id: startupId,
      meeting_date: format(new Date(), 'yyyy-MM-dd'),
      title: '',
      description: '',
      location: '',
      minutes: '',
      decisions: '',
      attendees: [{ name: '', email: '', role: '' }],
    },
  });
  
  const attendees = form.watch('attendees') || [];
  
  const addAttendee = () => {
    form.setValue('attendees', [...attendees, { name: '', email: '', role: '' }]);
  };
  
  const removeAttendee = (index: number) => {
    const newAttendees = [...attendees];
    newAttendees.splice(index, 1);
    form.setValue('attendees', newAttendees);
  };
  
  const openNewMeetingDialog = () => {
    form.reset({
      startup_id: startupId,
      meeting_date: format(new Date(), 'yyyy-MM-dd'),
      title: '',
      description: '',
      location: '',
      minutes: '',
      decisions: '',
      attendees: [{ name: '', email: '', role: '' }],
    });
    setIsEditing(false);
    setSelectedMeeting(null);
    setOpenDialog(true);
  };
  
  const openEditMeetingDialog = (meeting: any) => {
    setSelectedMeeting(meeting);
    setIsEditing(true);
    
    const formattedAttendees = meeting.attendees?.map((a: any) => ({
      name: a.member_name || '',
      email: a.member_email || '',
      role: a.member_role || '',
    })) || [{ name: '', email: '', role: '' }];
    
    form.reset({
      startup_id: startupId,
      meeting_date: meeting.meeting_date,
      title: meeting.title || '',
      description: meeting.description || '',
      location: meeting.location || '',
      minutes: meeting.minutes || '',
      decisions: meeting.decisions || '',
      attendees: formattedAttendees,
    });
    setOpenDialog(true);
  };
  
  const viewMeetingDetails = (meeting: any) => {
    setViewingMeeting(meeting);
    setShowDetails(true);
  };
  
  const onSubmit = async (values: BoardMeetingFormValues) => {
    try {
      if (isEditing && selectedMeeting) {
        await updateBoardMeeting(selectedMeeting.id, values);
      } else {
        await createBoardMeeting(values);
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
  
  if (isLoadingMeetings) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Reuniões do Conselho</h3>
        <Button onClick={openNewMeetingDialog} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Agendar Reunião
        </Button>
      </div>
      
      {boardMeetings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma reunião agendada para esta startup</p>
          <Button variant="outline" className="mt-4" onClick={openNewMeetingDialog}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Agendar Primeira Reunião
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {boardMeetings.map((meeting: any) => (
              <Card key={meeting.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{meeting.title}</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditMeetingDialog(meeting)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteMeeting(meeting.id)}>
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>{formatDate(meeting.meeting_date)}</span>
                    </div>
                    
                    {meeting.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{meeting.location}</span>
                      </div>
                    )}
                    
                    {meeting.attendees && meeting.attendees.length > 0 && (
                      <div className="flex items-start text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2 mt-1" />
                        <div className="flex flex-wrap gap-1">
                          {meeting.attendees.slice(0, 3).map((attendee: any, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {attendee.member_name}
                            </Badge>
                          ))}
                          {meeting.attendees.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{meeting.attendees.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {meeting.description && (
                      <p className="text-sm mt-2 line-clamp-2">{meeting.description}</p>
                    )}
                    
                    <Button 
                      variant="link" 
                      className="px-0 h-auto text-sm mt-1" 
                      onClick={() => viewMeetingDetails(meeting)}
                    >
                      Ver detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {/* Board Meeting Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Reunião' : 'Agendar Nova Reunião'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="meeting_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data da Reunião</FormLabel>
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
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Presencial ou link da videoconferência" />
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
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base">Participantes</FormLabel>
                  <Button type="button" variant="outline" size="sm" onClick={addAttendee}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
                
                {attendees.map((_, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      <FormField
                        control={form.control}
                        name={`attendees.${index}.name`}
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
                        name={`attendees.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`attendees.${index}.role`}
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
                    
                    {attendees.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttendee(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {isEditing && (
                <>
                  <FormField
                    control={form.control}
                    name="minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ata da Reunião</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
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
                        <FormLabel>Decisões Tomadas</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {isEditing ? 'Atualizar Reunião' : 'Agendar Reunião'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Meeting Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{viewingMeeting?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{viewingMeeting && formatDate(viewingMeeting.meeting_date)}</span>
              
              {viewingMeeting?.location && (
                <>
                  <span>•</span>
                  <Clock className="h-4 w-4" />
                  <span>{viewingMeeting.location}</span>
                </>
              )}
            </div>
            
            {viewingMeeting?.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Descrição</h4>
                <p className="text-sm whitespace-pre-line">{viewingMeeting.description}</p>
              </div>
            )}
            
            {viewingMeeting?.attendees && viewingMeeting.attendees.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Participantes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {viewingMeeting.attendees.map((attendee: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{attendee.member_name}</div>
                      {attendee.member_role && (
                        <div className="text-muted-foreground text-xs">{attendee.member_role}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {viewingMeeting?.minutes && (
              <div>
                <h4 className="text-sm font-medium mb-1">Ata da Reunião</h4>
                <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-line">
                  {viewingMeeting.minutes}
                </div>
              </div>
            )}
            
            {viewingMeeting?.decisions && (
              <div>
                <h4 className="text-sm font-medium mb-1">Decisões Tomadas</h4>
                <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-line">
                  {viewingMeeting.decisions}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setShowDetails(false);
              openEditMeetingDialog(viewingMeeting);
            }}>
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioBoardMeetingsSection;
