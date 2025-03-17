
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSubmitting,
  isEditMode = false,
}) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditMode ? 'Atualizando...' : 'Salvando...'}
          </>
        ) : (
          isEditMode ? 'Atualizar' : 'Salvar'
        )}
      </Button>
    </div>
  );
};
