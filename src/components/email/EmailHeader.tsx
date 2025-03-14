
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, PlusCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface EmailHeaderProps {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  startGmailAuth: () => void;
  disconnect: () => void;
  handleCreateTemplate: () => void;
}

const EmailHeader: React.FC<EmailHeaderProps> = ({
  isAuthenticated,
  isAuthLoading,
  authError,
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

  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">Email Templates</h1>
        <p className="text-muted-foreground">Manage your email templates for automated communications</p>
        {authError && (
          <div className="flex items-center gap-2 text-destructive mt-2 p-2 border border-destructive/30 rounded bg-destructive/10">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-sm">Erro: {authError}</span>
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
