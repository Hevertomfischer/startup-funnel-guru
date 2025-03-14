
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isSubmitting, 
  isEditMode 
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : isEditMode ? 'Atualizar Startup' : 'Adicionar Startup'}
      </Button>
    </div>
  );
};
