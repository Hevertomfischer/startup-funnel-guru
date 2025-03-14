
import React from 'react';
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <StartupForm
          startup={startup}
          statuses={statuses}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StartupDialog;
