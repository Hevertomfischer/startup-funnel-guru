
import { supabase, handleError } from './base-service';
import { EmailTemplate } from '@/types/email-template';

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as EmailTemplate[];
  } catch (error) {
    handleError(error, 'Failed to fetch email templates');
    return [];
  }
};

export const getEmailTemplateById = async (id: string): Promise<EmailTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data as EmailTemplate;
  } catch (error) {
    handleError(error, 'Failed to fetch email template');
    return null;
  }
};

export const createEmailTemplate = async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<EmailTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .insert({
        ...template,
        status: template.status as 'draft' | 'active' // Ensure correct type casting
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as EmailTemplate;
  } catch (error) {
    handleError(error, 'Failed to create email template');
    return null;
  }
};

export const updateEmailTemplate = async (id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | null> => {
  try {
    // Ensure we cast the status field correctly if it's included in updates
    const updateData = {
      ...updates,
      status: updates.status as 'draft' | 'active' // Ensure correct type casting if present
    };

    const { data, error } = await supabase
      .from('email_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as EmailTemplate;
  } catch (error) {
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

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    handleError(error, 'Failed to delete email template');
    return false;
  }
};

// Gmail authentication functions
export const getGmailAuthUrl = async (): Promise<string> => {
  try {
    const response = await supabase.functions.invoke('gmail-auth', {
      method: 'GET',
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data.authUrl;
  } catch (error: any) {
    handleError(error, 'Failed to get Gmail auth URL');
    throw error;
  }
};

export const refreshGmailToken = async (refreshToken: string): Promise<{ access_token: string, expires_in: number }> => {
  try {
    const response = await supabase.functions.invoke('refresh-token', {
      method: 'POST',
      body: { refresh_token: refreshToken },
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  } catch (error: any) {
    handleError(error, 'Failed to refresh Gmail token');
    throw error;
  }
};

export const sendEmail = async (
  to: string,
  subject: string,
  content: string,
  accessToken: string
): Promise<boolean> => {
  try {
    const response = await supabase.functions.invoke('send-email', {
      method: 'POST',
      body: {
        to,
        subject,
        content,
        accessToken,
      },
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return true;
  } catch (error: any) {
    handleError(error, 'Failed to send email');
    return false;
  }
};

// Function to replace template variables with actual values
export const processTemplateContent = (template: string, variables: Record<string, string>): string => {
  let processedContent = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    processedContent = processedContent.replace(placeholder, value);
  }
  
  return processedContent;
};
