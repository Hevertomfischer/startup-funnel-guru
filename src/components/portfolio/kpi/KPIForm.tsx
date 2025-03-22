
import React from 'react';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DialogFooter } from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { UseFormReturn } from 'react-hook-form';
import { AttachmentUploader, FileItem } from '@/components/shared/AttachmentUploader';
import { z } from 'zod';

export const kpiFormSchema = z.object({
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
  attachments: z.array(
    z.object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
      url: z.string()
    })
  ).optional(),
});

export type KpiFormValues = z.infer<typeof kpiFormSchema>;

interface KPIFormProps {
  form: UseFormReturn<KpiFormValues>;
  onSubmit: (values: KpiFormValues) => Promise<void>;
  onCancel: () => void;
  startupId: string;
  isEditing: boolean;
}

const KPIForm: React.FC<KPIFormProps> = ({
  form,
  onSubmit,
  onCancel,
  startupId,
  isEditing
}) => {
  return (
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
        
        <FormField
          control={form.control}
          name="attachments"
          render={({ field }) => (
            <AttachmentUploader
              attachments={field.value as FileItem[] || []}
              onChange={(attachments) => field.onChange(attachments)}
              label="Anexos"
              folderPath={`kpis/${startupId}`}
              relatedType="kpi"
              startup_id={startupId}
            />
          )}
        />
        
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default KPIForm;
