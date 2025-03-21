
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, PlusCircle, PencilIcon, Trash2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createKPI, updateKPI, deleteKPI } from '@/services/portfolio';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const kpiFormSchema = z.object({
  startup_id: z.string(),
  period: z.string().min(1, 'O período é obrigatório'),
  revenue: z.string().optional(),
  ebitda: z.string().optional(),
  burn_rate: z.string().optional(),
  cash_balance: z.string().optional(),
  client_count: z.string().optional(),
  team_size: z.string().optional(),
  custom_metric_name: z.string().optional(),
  custom_metric_value: z.string().optional(),
  notes: z.string().optional(),
});

type KpiFormValues = z.infer<typeof kpiFormSchema>;

interface PortfolioKPISectionProps {
  startupId: string;
  portfolio: any;
}

const PortfolioKPISection: React.FC<PortfolioKPISectionProps> = ({ startupId, portfolio }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<any>(null);
  const [date, setDate] = useState<Date>();
  
  const { kpis, isLoadingKPIs, refetchKPIs } = portfolio;
  
  const form = useForm<KpiFormValues>({
    resolver: zodResolver(kpiFormSchema),
    defaultValues: {
      startup_id: startupId,
      period: '',
      revenue: '',
      ebitda: '',
      burn_rate: '',
      cash_balance: '',
      client_count: '',
      team_size: '',
      custom_metric_name: '',
      custom_metric_value: '',
      notes: '',
    },
  });
  
  const openNewKpiDialog = () => {
    form.reset({
      startup_id: startupId,
      period: format(new Date(), 'yyyy-MM-dd'),
      revenue: '',
      ebitda: '',
      burn_rate: '',
      cash_balance: '',
      client_count: '',
      team_size: '',
      custom_metric_name: '',
      custom_metric_value: '',
      notes: '',
    });
    setIsEditing(false);
    setSelectedKpi(null);
    setOpenDialog(true);
  };
  
  const openEditKpiDialog = (kpi: any) => {
    setSelectedKpi(kpi);
    setIsEditing(true);
    form.reset({
      startup_id: startupId,
      period: kpi.period,
      revenue: kpi.revenue?.toString() || '',
      ebitda: kpi.ebitda?.toString() || '',
      burn_rate: kpi.burn_rate?.toString() || '',
      cash_balance: kpi.cash_balance?.toString() || '',
      client_count: kpi.client_count?.toString() || '',
      team_size: kpi.team_size?.toString() || '',
      custom_metric_name: kpi.custom_metric_name || '',
      custom_metric_value: kpi.custom_metric_value?.toString() || '',
      notes: kpi.notes || '',
    });
    setOpenDialog(true);
  };
  
  const onSubmit = async (values: KpiFormValues) => {
    try {
      // Convert string values to numbers where appropriate
      const numericFields = ['revenue', 'ebitda', 'burn_rate', 'cash_balance', 'client_count', 'team_size', 'custom_metric_value'];
      const preparedData: any = { ...values };
      
      numericFields.forEach(field => {
        if (values[field as keyof KpiFormValues] && values[field as keyof KpiFormValues] !== '') {
          const numValue = Number(values[field as keyof KpiFormValues]);
          if (!isNaN(numValue)) {
            preparedData[field] = numValue;
          }
        }
      });
      
      if (isEditing && selectedKpi) {
        await updateKPI(selectedKpi.id, preparedData);
      } else {
        await createKPI(preparedData);
      }
      
      refetchKPIs();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving KPI:', error);
      toast.error('Erro ao salvar KPI');
    }
  };
  
  const handleDeleteKpi = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este KPI?')) {
      try {
        await deleteKPI(id);
        refetchKPIs();
      } catch (error) {
        console.error('Error deleting KPI:', error);
        toast.error('Erro ao excluir KPI');
      }
    }
  };
  
  const formatCurrency = (value: any) => {
    if (value === null || value === undefined) return '-';
    return `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };
  
  const formatNumber = (value: any) => {
    if (value === null || value === undefined) return '-';
    return Number(value).toLocaleString('pt-BR');
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM yyyy', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  if (isLoadingKPIs) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Indicadores-Chave de Desempenho</h3>
        <Button onClick={openNewKpiDialog} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar KPI
        </Button>
      </div>
      
      {kpis.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum KPI registrado para esta startup</p>
          <Button variant="outline" className="mt-4" onClick={openNewKpiDialog}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Primeiro KPI
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Receita</TableHead>
                <TableHead>EBITDA</TableHead>
                <TableHead>Burn Rate</TableHead>
                <TableHead>Caixa</TableHead>
                <TableHead>Clientes</TableHead>
                <TableHead>Equipe</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpis.map((kpi: any) => (
                <TableRow key={kpi.id}>
                  <TableCell className="font-medium">{formatDate(kpi.period)}</TableCell>
                  <TableCell>{formatCurrency(kpi.revenue)}</TableCell>
                  <TableCell>{formatCurrency(kpi.ebitda)}</TableCell>
                  <TableCell>{formatCurrency(kpi.burn_rate)}</TableCell>
                  <TableCell>{formatCurrency(kpi.cash_balance)}</TableCell>
                  <TableCell>{formatNumber(kpi.client_count)}</TableCell>
                  <TableCell>{formatNumber(kpi.team_size)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" onClick={() => openEditKpiDialog(kpi)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteKpi(kpi.id)}>
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
      
      {/* KPI Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar KPI' : 'Adicionar Novo KPI'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Período</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(new Date(field.value), 'PP', { locale: ptBR })
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
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="revenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receita (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ebitda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EBITDA (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="burn_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Burn Rate (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cash_balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saldo de Caixa (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="client_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Clientes</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="team_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamanho da Equipe</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="custom_metric_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Métrica Personalizada (Nome)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="custom_metric_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Métrica Personalizada (Valor)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
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
                  {isEditing ? 'Atualizar KPI' : 'Adicionar KPI'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioKPISection;
