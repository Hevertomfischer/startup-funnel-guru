
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'active' | 'draft';
  created_at?: string;
  updated_at?: string;
}

export interface EmailTemplateFormValues {
  name: string;
  subject: string;
  content: string;
  status: 'active' | 'draft';
}
