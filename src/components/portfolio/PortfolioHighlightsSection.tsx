
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, PencilIcon, Trash2Icon, CalendarIcon, Medal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createHighlight, updateHighlight, deleteHighlight } from '@/services/portfolio';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const highlightFormSchema = z.object({
  startup_id: z.string(),
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  date: z.string().min(1, 'A data é obrigatória'),
  impact: z.string().optional(),
  link: z.string().url('Digite uma URL válida').optional().or(z.literal('')),
});

type HighlightFormValues = z.infer<typeof highlightFormSchema>;

interface PortfolioHighlightsSectionProps {
  startupId: string;
  portfolio: any;
}

const PortfolioHighlightsSection: React.FC<PortfolioHighlightsSectionProps> = ({ startupId, portfolio }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<any>(null);
  
  const { highlights, isLoadingHighlights, refetchHighlights } = portfolio;
  
  const form = useForm<HighlightFormValues>({
    resolver: zodResolver(highlightFormSchema),
    defaultValues: {
      startup_id: startupId,
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      impact: '',
      link: '',
    },
  });
  
  const openNewHighlightDialog = () => {
    form.reset({
      startup_id: startupId,
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      impact: '',
      link: '',
    });
    setIsEditing(false);
    setSelectedHighlight(null);
    setOpenDialog(true);
  };
  
  const openEditHighlightDialog = (highlight: any) => {
    setSelectedHighlight(highlight);
    setIsEditing(true);
    form.reset({
      startup_id: startupId,
      title: highlight.title || '',
      description: highlight.description || '',
      date: highlight.date || format(new Date(), 'yyyy-MM-dd'),
      impact: highlight.impact || '',
      link: highlight.link || '',
    });
    setOpenDialog(true);
  };
  
  const onSubmit = async (values: HighlightFormValues) => {
    try {
      if (isEditing && selectedHighlight) {
        await updateHighlight(selectedHighlight.id, values);
      } else {
        await createHighlight(values);
      }
      
      refetchHighlights();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving highlight:', error);
      toast.error('Erro ao salvar destaque');
    }
  };
  
  const handleDeleteHighlight = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este destaque?')) {
      try {
        await deleteHighlight(id);
        refetchHighlights();
      } catch (error) {
        console.error('Error deleting highlight:', error);
        toast.error('Erro ao excluir destaque');
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
  
  if (isLoadingHighlights) {
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
        <h3 className="text-lg font-semibold">Destaques e Conquistas</h3>
        <Button onClick={openNewHighlightDialog} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar Destaque
        </Button>
      </div>
      
      {highlights.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum destaque registrado para esta startup</p>
          <Button variant="outline" className="mt-4" onClick={openNewHighlightDialog}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Primeiro Destaque
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {highlights.map((highlight: any) => (
              <Card key={highlight.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center">
                        <Medal className="h-5 w-5 mr-2 text-yellow-500" />
                        <h4 className="font-medium">{highlight.title}</h4>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{formatDate(highlight.date)}</span>
                      </div>
                      
                      <p className="text-sm">{highlight.description}</p>
                      
                      {highlight.impact && (
                        <div>
                          <h5 className="text-sm font-medium">Impacto:</h5>
                          <p className="text-sm text-muted-foreground">{highlight.impact}</p>
                        </div>
                      )}
                      
                      {highlight.link && (
                        <div>
                          <a 
                            href={highlight.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            Ver mais detalhes
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1 ml-4">
                      <Button variant="ghost" size="icon" onClick={() => openEditHighlightDialog(highlight)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteHighlight(highlight.id)}>
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
      
      {/* Highlight Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Destaque' : 'Adicionar Novo Destaque'}</DialogTitle>
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
              
              <FormField
                control={form.control}
                name="date"
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
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
              
              <FormField
                control={form.control}
                name="impact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impacto</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={2} 
                        {...field} 
                        placeholder="Descreva o impacto desta conquista para a startup (opcional)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input 
                        type="url" 
                        {...field} 
                        placeholder="URL para mais informações (opcional)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {isEditing ? 'Atualizar' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioHighlightsSection;
