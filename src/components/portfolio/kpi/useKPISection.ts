
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createKPI, updateKPI, deleteKPI } from '@/services/portfolio';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { KpiFormValues, kpiFormSchema } from './KPIForm';

export const useKPISection = (startupId: string, portfolio: any) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<any>(null);
  
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
      attachments: [],
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
      attachments: [],
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
      attachments: kpi.attachments || [],
    });
    setOpenDialog(true);
  };
  
  const onSubmit = async (values: KpiFormValues) => {
    try {
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

  return {
    form,
    openDialog,
    setOpenDialog,
    isEditing,
    openNewKpiDialog,
    openEditKpiDialog,
    onSubmit,
    handleDeleteKpi,
    kpis,
    isLoadingKPIs
  };
};
