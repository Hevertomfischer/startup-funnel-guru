import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useGmailAuth } from '@/hooks/use-gmail-auth';
import { useEmailTemplates } from '@/hooks/use-email-templates';
import { EmailTemplate } from '@/types/email-template';

// Components
import EmailHeader from '@/components/email/EmailHeader';
import EmailTemplateFilters from '@/components/email/EmailTemplateFilters';
import EmailTemplateDialog from '@/components/email/EmailTemplateDialog';
import EmailSendDialog from '@/components/email/EmailSendDialog';
import EmailPreviewDialog from '@/components/email/EmailPreviewDialog';
import DeleteTemplateDialog from '@/components/email/DeleteTemplateDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Emails = () => {
  // Email template state and hooks
  const {
    templates,
    loading,
    fetchTemplates,
    templateToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteClick,
    handleConfirmDelete
  } = useEmailTemplates();

  // UI state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | undefined>(undefined);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [templateToSend, setTemplateToSend] = useState<EmailTemplate | null>(null);
  
  // Gmail auth hook
  const { 
    accessToken, 
    isAuthenticated, 
    isLoading: isAuthLoading,
    error: authError,
    authStage,
    startGmailAuth, 
    disconnect 
  } = useGmailAuth();

  // Track auth attempts for debugging
  const [authAttempts, setAuthAttempts] = useState(0);
  const [lastAuthTimestamp, setLastAuthTimestamp] = useState<string | null>(null);

  // Handle auth attempt tracking
  const handleAuthStart = () => {
    setAuthAttempts(prev => prev + 1);
    setLastAuthTimestamp(new Date().toISOString());
    startGmailAuth();
  };

  // Template actions
  const handleCreateTemplate = () => {
    setSelectedTemplate(undefined);
    setIsDialogOpen(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewDialogOpen(true);
  };
  
  const handleSendTemplate = (template: EmailTemplate) => {
    if (!isAuthenticated) {
      toast.error('Gmail authentication required', {
        description: 'Please connect your Gmail account first',
        action: {
          label: 'Connect',
          onClick: handleAuthStart
        }
      });
      return;
    }
    
    setTemplateToSend(template);
    setIsSendDialogOpen(true);
  };

  // Log auth state changes
  useEffect(() => {
    console.log('Auth state changed:', {
      isAuthenticated,
      authStage,
      authError: authError ? authError : null,
      tokenExists: !!accessToken
    });
  }, [isAuthenticated, authStage, authError, accessToken]);

  // Display auth debug info
  const renderAuthDebugInfo = () => {
    if (!authError && isAuthenticated) return null;
    
    return (
      <Alert variant={authError ? "destructive" : "default"} className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Gmail Authentication Status</AlertTitle>
        <AlertDescription>
          <div className="space-y-2 mt-2">
            <div><strong>Stage:</strong> {authStage || 'not_started'}</div>
            {authError && (
              <div>
                <strong>Error:</strong> {
                  typeof authError === 'object' && authError !== null && 'message' in authError 
                    ? authError.message 
                    : String(authError)
                }
              </div>
            )}
            <div><strong>Auth attempts:</strong> {authAttempts}</div>
            {lastAuthTimestamp && <div><strong>Last attempt:</strong> {new Date(lastAuthTimestamp).toLocaleString()}</div>}
            <div className="flex gap-2 mt-2">
              <Badge variant={isAuthenticated ? "default" : "outline"}>
                {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </Badge>
              <Badge variant={isAuthLoading ? "default" : "outline"}>
                {isAuthLoading ? "Loading..." : "Idle"}
              </Badge>
              <Badge variant={accessToken ? "default" : "outline"}>
                {accessToken ? "Token Present" : "No Token"}
              </Badge>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-6">
      {renderAuthDebugInfo()}
      
      <EmailHeader
        isAuthenticated={isAuthenticated}
        isAuthLoading={isAuthLoading}
        authError={authError}
        authStage={authStage}
        startGmailAuth={handleAuthStart}
        disconnect={disconnect}
        handleCreateTemplate={handleCreateTemplate}
      />
      
      <EmailTemplateFilters
        templates={templates}
        loading={loading}
        handleEditTemplate={handleEditTemplate}
        handleDeleteClick={handleDeleteClick}
        handlePreviewTemplate={handlePreviewTemplate}
        handleSendTemplate={handleSendTemplate}
        handleCreateTemplate={handleCreateTemplate}
      />

      {/* Template Editor Dialog */}
      <EmailTemplateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        template={selectedTemplate}
        onSuccess={fetchTemplates}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteTemplateDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        template={templateToDelete}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Preview Dialog */}
      <EmailPreviewDialog
        isOpen={isPreviewDialogOpen}
        onClose={() => setIsPreviewDialogOpen(false)}
        template={previewTemplate}
        onSend={handleSendTemplate}
      />

      {/* Send Email Dialog */}
      <EmailSendDialog
        isOpen={isSendDialogOpen}
        onClose={() => setIsSendDialogOpen(false)}
        template={templateToSend}
        accessToken={accessToken}
      />
    </div>
  );
};

export default Emails;
