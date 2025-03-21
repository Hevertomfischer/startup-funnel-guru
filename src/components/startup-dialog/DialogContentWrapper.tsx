
import React from 'react';
import {
  DialogTabs,
  DialogTabsList,
  DialogTabsTrigger,
  DialogTabsContent
} from '@/components/ui/dialog';
import StartupHistoryTab from '../startup-history/StartupHistoryTab';
import StartupFormWrapper from './StartupFormWrapper';
import { Status } from '@/types';
import { Briefcase } from 'lucide-react';

interface DialogContentWrapperProps {
  startup?: any;
  statuses: Status[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DialogContentWrapper: React.FC<DialogContentWrapperProps> = ({
  startup,
  statuses,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  // Determine if we should show the history tab (only for existing startups)
  const showHistoryTab = startup?.id ? true : false;
  
  // Check if startup has an "Investida" status - this is for the portfolio management
  const isInvestedStartup = startup?.status_id && statuses.some(
    status => status.id === startup.status_id && 
    status.name.toLowerCase().includes('investida')
  );
  
  console.log('Is invested startup:', isInvestedStartup);
  
  if (showHistoryTab) {
    return (
      <DialogTabs defaultValue="form">
        <DialogTabsList className={isInvestedStartup ? "grid grid-cols-3" : "grid grid-cols-2"}>
          <DialogTabsTrigger value="form">Formulário</DialogTabsTrigger>
          <DialogTabsTrigger value="history">Histórico</DialogTabsTrigger>
          {isInvestedStartup && (
            <DialogTabsTrigger value="portfolio" className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Portfólio
            </DialogTabsTrigger>
          )}
        </DialogTabsList>
        
        <DialogTabsContent value="form">
          <StartupFormWrapper
            startup={startup}
            statuses={statuses}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
          />
        </DialogTabsContent>
        
        <DialogTabsContent value="history">
          <StartupHistoryTab startupId={startup.id} />
        </DialogTabsContent>
        
        {isInvestedStartup && (
          <DialogTabsContent value="portfolio">
            <div className="p-4 text-center">
              <p className="mb-4">Esta startup está no portfólio de investimentos.</p>
              <p className="text-muted-foreground">
                Acesse a página de Portfólio para gerenciar KPIs, reuniões do conselho, 
                necessidades estratégicas e destaques desta startup.
              </p>
            </div>
          </DialogTabsContent>
        )}
      </DialogTabs>
    );
  }
  
  return (
    <StartupFormWrapper
      startup={startup}
      statuses={statuses}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default DialogContentWrapper;
