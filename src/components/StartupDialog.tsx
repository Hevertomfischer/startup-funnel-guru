
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
    
    // Prepare data for Supabase
    const startupData = {
      // Map form values to database schema
      name: data.values.Startup,
      status_id: data.statusId,
      priority: data.priority,
      assigned_to: data.assignedTo || null,
      due_date: data.dueDate || null,
      website: data.values["Site da Startup"] || null,
      problem_solved: data.values["Problema que Resolve"] || null,
      sector: data.values.Setor || null,
      business_model: data.values["Modelo de Negócio"] || null,
      
      // Ensure numeric fields are properly converted
      mrr: data.values.MRR ? Number(data.values.MRR) : null,
      client_count: data.values["Quantidade de Clientes"] ? Number(data.values["Quantidade de Clientes"]) : null,
      
      // If it's an update, include the id
      ...(startup?.id && { id: startup.id }),
      // For updates, track previous status
      ...(startup?.status_id && { old_status_id: startup.status_id })
    };
    
    console.log('Mapped startup data to send to Supabase:', startupData);
    
    try {
      onSubmit(startupData);
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
