
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { PlusCircle, Trash2Icon, CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AttachmentUploader } from '@/components/shared/AttachmentUploader';
import { BoardMeetingFormValues, FileItem } from './schema';

interface BoardMeetingFormProps {
  form: UseFormReturn<BoardMeetingFormValues>;
  onSubmit: (values: BoardMeetingFormValues) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
  startupId: string;
}

const BoardMeetingForm: React.FC<BoardMeetingFormProps> = ({ 
  form, 
  onSubmit, 
  onCancel, 
  isEditing,
  startupId 
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PP', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  const addAttendee = () => {
    const currentAttendees = form.getValues('attendees') || [];
    form.setValue('attendees', [...currentAttendees, { member_name: '', member_email: '', member_role: '' }]);
  };
  
  const removeAttendee = (index: number) => {
    const currentAttendees = form.getValues('attendees') || [];
    if (currentAttendees.length <= 1) return;
    
    form.setValue('attendees', currentAttendees.filter((_, i) => i !== index));
  };

  return (
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
              attachments={field.value as FileItem[] || []}
              onChange={(attachments) => field.onChange(attachments)}
              label="Documentos da Reunião"
              folderPath={`board-meetings/${startupId}`}
              relatedType="board_meeting"
            />
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? 'Atualizar' : 'Agendar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default BoardMeetingForm;
