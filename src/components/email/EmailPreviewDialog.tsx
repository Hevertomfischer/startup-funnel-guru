
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { EmailTemplate } from '@/types/email-template';

interface EmailPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplate | null;
  onSend: (template: EmailTemplate) => void;
}

const EmailPreviewDialog: React.FC<EmailPreviewDialogProps> = ({ 
  isOpen,
  onClose,
  template,
  onSend
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen => !setIsOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            Preview: {template?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="border p-4 rounded-md">
          <div className="mb-4 pb-2 border-b">
            <div className="text-sm text-muted-foreground">From: SCVentures &lt;no-reply@scventures.com&gt;</div>
            <div className="text-sm text-muted-foreground">To: [Recipient]</div>
            <div className="text-sm font-semibold mt-2">Subject: {template?.subject}</div>
          </div>
          <div className="prose prose-sm max-w-none">
            <div style={{ whiteSpace: 'pre-line' }}>
              {template?.content}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {template?.status === 'active' && (
            <Button onClick={() => {
              onClose();
              onSend(template);
            }}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPreviewDialog;
