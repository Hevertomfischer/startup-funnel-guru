
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { EmailTemplate } from '@/types/email-template';
import { sendEmail } from '@/services/email-template-service';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const sendEmailSchema = z.object({
  to: z.string().email('Please enter a valid email address'),
  startup_name: z.string().min(1, 'Startup name is required'),
  // Optional fields that might be used in templates
  investment_amount: z.string().optional(),
  equity_percentage: z.string().optional(),
  valuation: z.string().optional(),
});

type SendEmailFormValues = z.infer<typeof sendEmailSchema>;

interface EmailSendDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplate | null;
  accessToken: string | null;
}

const EmailSendDialog: React.FC<EmailSendDialogProps> = ({
  isOpen,
  onClose,
  template,
  accessToken,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');

  const form = useForm<SendEmailFormValues>({
    resolver: zodResolver(sendEmailSchema),
    defaultValues: {
      to: '',
      startup_name: '',
      investment_amount: '',
      equity_percentage: '',
      valuation: '',
    },
  });

  const updatePreview = (values: SendEmailFormValues) => {
    if (!template) return;
    
    let content = template.content;
    let subject = template.subject;
    
    // Replace placeholders
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        const regex = new RegExp(`{${key}}`, 'g');
        content = content.replace(regex, value);
        subject = subject.replace(regex, value);
      }
    });
    
    setPreviewContent(`
      <div style="border-bottom: 1px solid #ddd; margin-bottom: 16px; padding-bottom: 8px;">
        <div><strong>To:</strong> ${values.to}</div>
        <div><strong>Subject:</strong> ${subject}</div>
      </div>
      <div>${content.replace(/\n/g, '<br>')}</div>
    `);
  };

  // Update preview when form values change
  useEffect(() => {
    const subscription = form.watch((values) => {
      updatePreview(values as SendEmailFormValues);
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch, template]);

  // Initialize preview when template changes
  useEffect(() => {
    if (template && isOpen) {
      updatePreview(form.getValues());
    }
  }, [template, isOpen]);

  const onSubmit = async (values: SendEmailFormValues) => {
    if (!template || !accessToken) {
      toast.error('Missing template or Gmail authentication');
      return;
    }
    
    setIsSending(true);
    try {
      const success = await sendEmail(
        values.to,
        template.id,
        {
          startup_name: values.startup_name,
          investment_amount: values.investment_amount || '',
          equity_percentage: values.equity_percentage || '',
          valuation: values.valuation || '',
        },
        accessToken
      );
      
      if (success) {
        onClose();
      }
    } finally {
      setIsSending(false);
    }
  };

  // Check if template content contains specific placeholders
  const hasPlaceholder = (placeholder: string): boolean => {
    return template?.content.includes(`{${placeholder}}`) || template?.subject.includes(`{${placeholder}}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            Send Email: {template?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="recipient@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startup_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Startup Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter startup name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {hasPlaceholder('investment_amount') && (
                  <FormField
                    control={form.control}
                    name="investment_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment Amount</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 500000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {hasPlaceholder('equity_percentage') && (
                  <FormField
                    control={form.control}
                    name="equity_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equity Percentage</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {hasPlaceholder('valuation') && (
                  <FormField
                    control={form.control}
                    name="valuation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valuation</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 5000000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={onClose} type="button">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSending || !accessToken}>
                    {isSending ? 'Sending...' : 'Send Email'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Preview</h3>
            <div className="border rounded-md p-4 h-[400px] overflow-auto bg-background">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailSendDialog;
