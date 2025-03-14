
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
    return data || [];
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
    return data;
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
    return data;
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
    return data;
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
