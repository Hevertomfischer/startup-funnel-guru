
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, PlusCircle } from 'lucide-react';

interface EmailHeaderProps {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  startGmailAuth: () => void;
  disconnect: () => void;
  handleCreateTemplate: () => void;
}

const EmailHeader: React.FC<EmailHeaderProps> = ({
  isAuthenticated,
  isAuthLoading,
  startGmailAuth,
  disconnect,
  handleCreateTemplate
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">Email Templates</h1>
        <p className="text-muted-foreground">Manage your email templates for automated communications</p>
      </div>
      <div className="flex gap-2">
        {isAuthenticated ? (
          <Button variant="outline" className="flex items-center gap-2" onClick={disconnect}>
            <Mail className="h-4 w-4" />
            Disconnect Gmail
          </Button>
        ) : (
          <Button variant="outline" className="flex items-center gap-2" onClick={startGmailAuth} disabled={isAuthLoading}>
            <Mail className="h-4 w-4" />
            {isAuthLoading ? 'Connecting...' : 'Connect Gmail'}
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
