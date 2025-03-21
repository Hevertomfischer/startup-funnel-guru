
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DialogContentWrapper from './startup-dialog/DialogContentWrapper';
import { Status } from '@/types';
import { useWorkflowRules } from '@/hooks/use-workflow-rules';

interface StartupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  startup?: any;
  statuses: Status[];
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const StartupDialog: React.FC<StartupDialogProps> = ({
  open,
  onOpenChange,
  title,
  startup,
  statuses,
  onSubmit,
  isSubmitting,
}) => {
  console.log('StartupDialog rendered with open:', open);
  console.log('Startup data:', startup);
  console.log('Status length:', statuses?.length);
  
  // Get workflow rules for automation
  const { rules } = useWorkflowRules();
  
  useEffect(() => {
    console.log('StartupDialog useEffect - open state changed to:', open);
  }, [open]);
  
  const handleCancel = () => onOpenChange(false);
  
  // Check if any status has "Investida" in its name - for portfolio integration
  const hasInvestedStatus = statuses.some(status => 
    status.name.toLowerCase().includes('investida')
  );
  console.log('Has invested status option:', hasInvestedStatus);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] md:max-w-[1000px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <DialogContentWrapper
          startup={startup}
          statuses={statuses}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StartupDialog;
