
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface EmailConfirmationAlertProps {
  isResending: boolean;
  resendSuccess: boolean;
  onResend: () => void;
}

export function EmailConfirmationAlert({ 
  isResending, 
  resendSuccess,
  onResend 
}: EmailConfirmationAlertProps) {
  return (
    <Alert variant="destructive">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Email não confirmado</AlertTitle>
      <AlertDescription>
        Por favor, verifique seu email e confirme sua conta antes de fazer login.
        <Button 
          variant="outline" 
          className="mt-2 w-full"
          onClick={onResend}
          disabled={isResending || resendSuccess}
        >
          {isResending ? 'Enviando...' : resendSuccess ? 'Email reenviado' : 'Reenviar email de confirmação'}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
