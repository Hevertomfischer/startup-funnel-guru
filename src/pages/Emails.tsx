
import React, { useState } from 'react';
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
    startGmailAuth, 
    disconnect 
  } = useGmailAuth();

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
          onClick: startGmailAuth
        }
      });
      return;
    }
    
    setTemplateToSend(template);
    setIsSendDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <EmailHeader
        isAuthenticated={isAuthenticated}
        isAuthLoading={isAuthLoading}
        startGmailAuth={startGmailAuth}
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
