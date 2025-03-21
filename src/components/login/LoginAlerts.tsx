
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { EmailConfirmationAlert } from './EmailConfirmationAlert';

interface LoginAlertsProps {
  loginError: string | null;
  emailNotConfirmed: boolean;
  resendSuccess: boolean;
  isResending: boolean;
  onResend: () => void;
}

export function LoginAlerts({
  loginError,
  emailNotConfirmed,
  resendSuccess,
  isResending,
  onResend
}: LoginAlertsProps) {
  return (
    <>
      {emailNotConfirmed && (
        <EmailConfirmationAlert 
          isResending={isResending} 
          resendSuccess={resendSuccess} 
          onResend={onResend} 
        />
      )}

      {loginError && (
        <Alert variant="destructive">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Erro de login</AlertTitle>
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      {resendSuccess && !emailNotConfirmed && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Email reenviado</AlertTitle>
          <AlertDescription>
            Um novo email de confirmação foi enviado. Por favor, verifique sua caixa de entrada.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
