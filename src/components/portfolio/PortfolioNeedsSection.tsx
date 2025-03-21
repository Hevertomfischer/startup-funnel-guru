
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, PencilIcon, Trash2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createStrategicNeed, updateStrategicNeed, deleteStrategicNeed } from '@/services/portfolio';
import { toast } from 'sonner';

const needFormSchema = z.object({
  startup_id: z.string(),
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  type: z.string().min(1, 'O tipo é obrigatório'),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['pending', 'in_progress', 'completed']),
  due_date: z.string().optional(),
  assigned_to: z.string().optional(),
});

type NeedFormValues = z.infer<typeof needFormSchema>;

interface PortfolioNeedsSectionProps {
  startupId: string;
  portfolio: any;
}

const PortfolioNeedsSection: React.FC<PortfolioNeedsSectionProps> = ({ startupId, portfolio }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState<any>(null);
  
  const { strategicNeeds, isLoadingNeeds, refetchNeeds } = portfolio;
  
  const form = useForm<NeedFormValues>({
    resolver: zodResolver(needFormSchema),
    defaultValues: {
      startup_id: startupId,
      title: '',
      description: '',
      type: '',
      priority: 'medium',
      status: 'pending',
      due_date: '',
      assigned_to: '',
    },
  });
  
  const openNewNeedDialog = () => {
    form.reset({
      startup_id: startupId,
      title: '',
      description: '',
      type: '',
      priority: 'medium',
      status: 'pending',
      due_date: '',
      assigned_to: '',
    });
    setIsEditing(false);
    setSelectedNeed(null);
    setOpenDialog(true);
  };
  
  const openEditNeedDialog = (need: any) => {
    setSelectedNeed(need);
    setIsEditing(true);
    form.reset({
      startup_id: startupId,
      title: need.title || '',
      description: need.description || '',
      type: need.type || '',
      priority: need.priority || 'medium',
      status: need.status || 'pending',
      due_date: need.due_date || '',
      assigned_to: need.assigned_to || '',
    });
    setOpenDialog(true);
  };
  
  const onSubmit = async (values: NeedFormValues) => {
    try {
      if (isEditing && selectedNeed) {
        await updateStrategicNeed(selectedNeed.id, values);
      } else {
        await createStrategicNeed(values);
      }
      
      refetchNeeds();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving strategic need:', error);
      toast.error('Erro ao salvar necessidade estratégica');
    }
  };
  
  const handleDeleteNeed = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta necessidade estratégica?')) {
      try {
        await deleteStrategicNeed(id);
        refetchNeeds();
      } catch (error) {
        console.error('Error deleting strategic need:', error);
        toast.error('Erro ao excluir necessidade estratégica');
      }
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Progresso';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };
  
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };
  
  if (isLoadingNeeds) {
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
        <h3 className="text-lg font-semibold">Necessidades Estratégicas</h3>
        <Button onClick={openNewNeedDialog} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar Necessidade
        </Button>
      </div>
      
      {strategicNeeds.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma necessidade estratégica registrada para esta startup</p>
          <Button variant="outline" className="mt-4" onClick={openNewNeedDialog}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Primeira Necessidade
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategicNeeds.map((need: any) => (
              <Card key={need.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-medium">{need.title}</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {need.type && (
                          <Badge variant="outline">{need.type}</Badge>
                        )}
                        <Badge className={getPriorityColor(need.priority)}>
                          {getPriorityText(need.priority)}
                        </Badge>
                        <Badge className={getStatusColor(need.status)}>
                          {getStatusText(need.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">{need.description}</p>
                    </div>
                    <div className="flex flex-col space-y-1 ml-4">
                      <Button variant="ghost" size="icon" onClick={() => openEditNeedDialog(need)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteNeed(need.id)}>
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {(need.due_date || need.assigned_to) && (
                    <div className="mt-3 pt-3 border-t text-xs text-muted-foreground space-y-1">
                      {need.due_date && (
                        <div>Data limite: {format(new Date(need.due_date), 'PP', { locale: ptBR })}</div>
                      )}
                      {need.assigned_to && (
                        <div>Responsável: {need.assigned_to}</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {/* Need Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Necessidade' : 'Adicionar Nova Necessidade'}</DialogTitle>
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mentoria">Mentoria</SelectItem>
                          <SelectItem value="financeiro">Financeiro</SelectItem>
                          <SelectItem value="networking">Networking</SelectItem>
                          <SelectItem value="parceria">Parceria</SelectItem>
                          <SelectItem value="contratação">Contratação</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="técnico">Técnico</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a prioridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="low">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="in_progress">Em Progresso</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Limite</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Nome da pessoa responsável por esta necessidade
                    </FormDescription>
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

export default PortfolioNeedsSection;
