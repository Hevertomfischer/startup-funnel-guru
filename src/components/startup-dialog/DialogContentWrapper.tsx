
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
  
  if (showHistoryTab) {
    return (
      <DialogTabs defaultValue="form">
        <DialogTabsList className="grid grid-cols-2">
          <DialogTabsTrigger value="form">Formulário</DialogTabsTrigger>
          <DialogTabsTrigger value="history">Histórico</DialogTabsTrigger>
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
