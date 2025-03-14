
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, PlusCircle, Filter, AlertCircle } from 'lucide-react';
import { 
  getEmailTemplates, 
  deleteEmailTemplate 
} from '@/services/email-template-service';
import { EmailTemplate } from '@/types/email-template';
import EmailTemplateDialog from '@/components/email/EmailTemplateDialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

const Emails = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await getEmailTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load email templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreateTemplate = () => {
    setSelectedTemplate(undefined);
    setIsDialogOpen(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (template: EmailTemplate) => {
    setTemplateToDelete(template);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;
    
    try {
      const success = await deleteEmailTemplate(templateToDelete.id);
      if (success) {
        setTemplates(templates.filter(t => t.id !== templateToDelete.id));
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    } finally {
      setIsDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  const renderTemplateList = (templateList: EmailTemplate[]) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      );
    }

    if (templateList.length === 0) {
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
        {templateList.map(template => (
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Email Templates</h1>
          <p className="text-muted-foreground">Manage your email templates for automated communications</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleCreateTemplate}>
          <PlusCircle className="h-4 w-4" />
          Create Template
        </Button>
      </div>
      
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
          {renderTemplateList(templates)}
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          {renderTemplateList(templates.filter(template => template.status === 'active'))}
        </TabsContent>
        
        <TabsContent value="draft" className="mt-0">
          {renderTemplateList(templates.filter(template => template.status === 'draft'))}
        </TabsContent>
      </Tabs>

      {/* Template Editor Dialog */}
      <EmailTemplateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        template={selectedTemplate}
        onSuccess={fetchTemplates}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the email template 
              "{templateToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              Preview: {previewTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="border p-4 rounded-md">
            <div className="mb-4 pb-2 border-b">
              <div className="text-sm text-muted-foreground">From: SCVentures &lt;no-reply@scventures.com&gt;</div>
              <div className="text-sm text-muted-foreground">To: [Recipient]</div>
              <div className="text-sm font-semibold mt-2">Subject: {previewTemplate?.subject}</div>
            </div>
            <div className="prose prose-sm max-w-none">
              <div style={{ whiteSpace: 'pre-line' }}>
                {previewTemplate?.content}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Emails;
