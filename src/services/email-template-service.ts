
import { supabase, handleError } from './base-service';
import { toast } from 'sonner';
import type { EmailTemplate } from '@/types/email-template';

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

export const createEmailTemplate = async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<EmailTemplate | null> => {
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

export const updateEmailTemplate = async (id: string, template: Partial<EmailTemplate>): Promise<EmailTemplate | null> => {
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
