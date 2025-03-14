
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmailTemplate, EmailTemplateFormValues } from '@/types/email-template';
import EmailTemplateForm from './EmailTemplateForm';
import { createEmailTemplate, updateEmailTemplate } from '@/services/email-template-service';

interface EmailTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template?: EmailTemplate;
  onSuccess: () => void;
}

const EmailTemplateDialog: React.FC<EmailTemplateDialogProps> = ({
  isOpen,
  onClose,
  template,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: EmailTemplateFormValues) => {
    setIsSubmitting(true);
    try {
      if (template) {
        // Update existing template
        await updateEmailTemplate(template.id, values);
      } else {
        // Create new template
        await createEmailTemplate(values);
      }
      onSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Edit Email Template' : 'Create Email Template'}
          </DialogTitle>
        </DialogHeader>
        <EmailTemplateForm
          template={template}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmailTemplateDialog;
