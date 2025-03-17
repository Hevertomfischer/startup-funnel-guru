
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import StartupForm from './StartupForm';
import { Status } from '@/types';

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
  
  useEffect(() => {
    console.log('StartupDialog useEffect - open state changed to:', open);
  }, [open]);
  
  const handleFormSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    try {
      onSubmit(data);
    } catch (error) {
      console.error('Error in startup form submission:', error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <StartupForm
          startup={startup}
          statuses={statuses}
          onSubmit={handleFormSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StartupDialog;
