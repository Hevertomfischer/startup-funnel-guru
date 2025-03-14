
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, PlusCircle, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

interface EmailHeaderProps {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: string | null | Error | any;
  authStage?: string;
  startGmailAuth: () => void;
  disconnect: () => void;
  handleCreateTemplate: () => void;
}

const EmailHeader: React.FC<EmailHeaderProps> = ({
  isAuthenticated,
  isAuthLoading,
  authError,
  authStage,
  startGmailAuth,
  disconnect,
  handleCreateTemplate
}) => {
  const handleAuthClick = () => {
    if (authError) {
      toast.error('Erro na conexão anterior', {
        description: 'Tentando novamente. Se o problema persistir, verifique se pop-ups estão permitidos.',
        action: {
          label: 'Ajuda',
          onClick: () => window.open('https://support.google.com/accounts/answer/6010255', '_blank')
        }
      });
    }
    startGmailAuth();
  };

  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) return error.message;
    return String(error);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">Email Templates</h1>
        <p className="text-muted-foreground">Manage your email templates for automated communications</p>
        
        {authStage && (
          <div className="flex items-center gap-2 text-blue-500 mt-2 p-2 border border-blue-200 rounded bg-blue-50">
            <Info className="h-4 w-4 shrink-0" />
            <span className="text-sm">Auth status: {authStage}</span>
          </div>
        )}
        
        {authError && (
          <div className="flex items-center gap-2 text-destructive mt-2 p-2 border border-destructive/30 rounded bg-destructive/10">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-sm">Erro: {getErrorMessage(authError)}</span>
            <Button variant="ghost" size="sm" onClick={() => window.open('https://support.google.com/accounts/answer/6010255', '_blank')}>
              Ajuda
            </Button>
          </div>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        {isAuthenticated ? (
          <Button variant="outline" className="flex items-center gap-2" onClick={disconnect}>
            <Mail className="h-4 w-4" />
            Disconnect Gmail
          </Button>
        ) : (
          <Button variant="outline" className="flex items-center gap-2" onClick={handleAuthClick} disabled={isAuthLoading}>
            <Mail className="h-4 w-4" />
            {isAuthLoading ? 'Conectando...' : 'Connect Gmail'}
          </Button>
        )}
        <Button className="flex items-center gap-2" onClick={handleCreateTemplate}>
          <PlusCircle className="h-4 w-4" />
          Create Template
        </Button>
      </div>
    </div>
  );
};

export default EmailHeader;
