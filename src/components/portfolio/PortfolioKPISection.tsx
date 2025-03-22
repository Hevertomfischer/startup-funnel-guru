
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import KPIForm from './kpi/KPIForm';
import KPITable from './kpi/KPITable';
import KPIEmptyState from './kpi/KPIEmptyState';
import { useKPISection } from './kpi/useKPISection';

interface PortfolioKPISectionProps {
  startupId: string;
  portfolio: any;
}

const PortfolioKPISection: React.FC<PortfolioKPISectionProps> = ({ startupId, portfolio }) => {
  const {
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
  } = useKPISection(startupId, portfolio);
  
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
        <KPIEmptyState onAddClick={openNewKpiDialog} />
      ) : (
        <KPITable 
          kpis={kpis} 
          onEdit={openEditKpiDialog}
          onDelete={handleDeleteKpi}
        />
      )}
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar KPI' : 'Adicionar Novo KPI'}</DialogTitle>
          </DialogHeader>
          
          <KPIForm
            form={form}
            onSubmit={onSubmit}
            onCancel={() => setOpenDialog(false)}
            startupId={startupId}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioKPISection;
