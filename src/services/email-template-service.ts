
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { EmailTemplate, EmailTemplateFormValues } from '@/types/email-template';

// Helper function to handle errors
const handleError = (error: any, message: string): void => {
  toast.error(message, {
    description: error.message
  });
  console.error(`${message}:`, error);
};

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Cast the status field to the correct type
    return (data || []).map(template => ({
      ...template,
      status: template.status as 'active' | 'draft'
    }));
  } catch (error: any) {
    handleError(error, 'Failed to fetch email templates');
    return [];
  }
};

export const getEmailTemplate = async (id: string): Promise<EmailTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (data) {
      return {
        ...data,
        status: data.status as 'active' | 'draft'
      };
    }
    return null;
  } catch (error: any) {
    handleError(error, 'Failed to fetch email template');
    return null;
  }
};

export const createEmailTemplate = async (template: EmailTemplateFormValues): Promise<EmailTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .insert(template)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Email template created successfully');
    
    if (data) {
      return {
        ...data,
        status: data.status as 'active' | 'draft'
      };
    }
    return null;
  } catch (error: any) {
    handleError(error, 'Failed to create email template');
    return null;
  }
};

export const updateEmailTemplate = async (id: string, template: EmailTemplateFormValues): Promise<EmailTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .update(template)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Email template updated successfully');
    
    if (data) {
      return {
        ...data,
        status: data.status as 'active' | 'draft'
      };
    }
    return null;
  } catch (error: any) {
    handleError(error, 'Failed to update email template');
    return null;
  }
};

export const deleteEmailTemplate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Email template deleted successfully');
    return true;
  } catch (error: any) {
    handleError(error, 'Failed to delete email template');
    return false;
  }
};

// Novas funções para integração com Gmail
export const getGmailAuthUrl = async (): Promise<string> => {
  try {
    const response = await supabase.functions.invoke('gmail-auth');
    
    if (response.error) throw new Error(response.error.message);
    return response.data.authUrl;
  } catch (error: any) {
    handleError(error, 'Failed to generate Gmail authentication URL');
    throw error;
  }
};

export const refreshGmailToken = async (refreshToken: string): Promise<{ access_token: string, expires_in: number }> => {
  try {
    const response = await supabase.functions.invoke('refresh-token', {
      body: { refresh_token: refreshToken }
    });
    
    if (response.error) throw new Error(response.error.message);
    return response.data;
  } catch (error: any) {
    handleError(error, 'Failed to refresh Gmail token');
    throw error;
  }
};

export const sendEmail = async (
  to: string, 
  templateId: string, 
  data: Record<string, string>,
  accessToken: string
): Promise<boolean> => {
  try {
    // Get the email template
    const template = await getEmailTemplate(templateId);
    if (!template) {
      throw new Error('Email template not found');
    }
    
    // Process template placeholders
    let subject = template.subject;
    let content = template.content;
    
    // Replace placeholders in subject and content
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      subject = subject.replace(regex, value);
      content = content.replace(regex, value);
    });
    
    // Send the email using the edge function
    const response = await supabase.functions.invoke('send-email', {
      body: {
        to,
        subject,
        content,
        accessToken
      }
    });
    
    if (response.error || !response.data.success) {
      throw new Error(response.error?.message || response.data.error || 'Failed to send email');
    }
    
    toast.success('Email sent successfully');
    return true;
  } catch (error: any) {
    handleError(error, 'Failed to send email');
    return false;
  }
};
