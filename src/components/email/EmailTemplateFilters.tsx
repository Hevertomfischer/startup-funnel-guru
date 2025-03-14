
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter } from 'lucide-react';
import { EmailTemplate } from '@/types/email-template';
import EmailTemplateList from './EmailTemplateList';

interface EmailTemplateFiltersProps {
  templates: EmailTemplate[];
  loading: boolean;
  handleEditTemplate: (template: EmailTemplate) => void;
  handleDeleteClick: (template: EmailTemplate) => void;
  handlePreviewTemplate: (template: EmailTemplate) => void;
  handleSendTemplate: (template: EmailTemplate) => void;
  handleCreateTemplate: () => void;
}

const EmailTemplateFilters: React.FC<EmailTemplateFiltersProps> = ({
  templates,
  loading,
  handleEditTemplate,
  handleDeleteClick,
  handlePreviewTemplate,
  handleSendTemplate,
  handleCreateTemplate
}) => {
  return (
    <Tabs defaultValue="all">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
        
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <TabsContent value="all" className="mt-0">
        <EmailTemplateList
          templates={templates}
          loading={loading}
          handleEditTemplate={handleEditTemplate}
          handleDeleteClick={handleDeleteClick}
          handlePreviewTemplate={handlePreviewTemplate}
          handleSendTemplate={handleSendTemplate}
          handleCreateTemplate={handleCreateTemplate}
        />
      </TabsContent>
      
      <TabsContent value="active" className="mt-0">
        <EmailTemplateList
          templates={templates.filter(template => template.status === 'active')}
          loading={loading}
          handleEditTemplate={handleEditTemplate}
          handleDeleteClick={handleDeleteClick}
          handlePreviewTemplate={handlePreviewTemplate}
          handleSendTemplate={handleSendTemplate}
          handleCreateTemplate={handleCreateTemplate}
        />
      </TabsContent>
      
      <TabsContent value="draft" className="mt-0">
        <EmailTemplateList
          templates={templates.filter(template => template.status === 'draft')}
          loading={loading}
          handleEditTemplate={handleEditTemplate}
          handleDeleteClick={handleDeleteClick}
          handlePreviewTemplate={handlePreviewTemplate}
          handleSendTemplate={handleSendTemplate}
          handleCreateTemplate={handleCreateTemplate}
        />
      </TabsContent>
    </Tabs>
  );
};

export default EmailTemplateFilters;
