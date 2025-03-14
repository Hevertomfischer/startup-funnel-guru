
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, AlertCircle } from 'lucide-react';
import { EmailTemplate } from '@/types/email-template';

interface EmailTemplateListProps {
  templates: EmailTemplate[];
  loading: boolean;
  handleEditTemplate: (template: EmailTemplate) => void;
  handleDeleteClick: (template: EmailTemplate) => void;
  handlePreviewTemplate: (template: EmailTemplate) => void;
  handleSendTemplate: (template: EmailTemplate) => void;
  handleCreateTemplate: () => void;
}

const EmailTemplateList: React.FC<EmailTemplateListProps> = ({
  templates,
  loading,
  handleEditTemplate,
  handleDeleteClick,
  handlePreviewTemplate,
  handleSendTemplate,
  handleCreateTemplate
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-muted-foreground">Loading templates...</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-muted/10">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground mb-4">No email templates found</p>
        <Button onClick={handleCreateTemplate} variant="outline">Create your first template</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {templates.map(template => (
        <Card key={template.id} className="overflow-hidden">
          <div className="flex items-stretch">
            <div className="bg-muted p-4 flex items-center justify-center">
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant={template.status === 'active' ? 'default' : 'outline'}>
                    {template.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{template.subject}</p>
                  <p className="text-xs">
                    Last edited: {template.updated_at 
                      ? new Date(template.updated_at).toLocaleDateString() 
                      : 'Unknown'}
                  </p>
                  
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePreviewTemplate(template)}
                    >
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendTemplate(template)}
                      disabled={template.status !== 'active'}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Send
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground ml-auto"
                      onClick={() => handleDeleteClick(template)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EmailTemplateList;
