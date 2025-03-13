
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, PlusCircle, Filter } from 'lucide-react';

const emailTemplates = [
  {
    id: '1',
    name: 'Initial Contact',
    subject: 'Thank you for your interest in SCVentures',
    lastEdited: '2 days ago',
    status: 'active'
  },
  {
    id: '2',
    name: 'Due Diligence Request',
    subject: 'SCVentures - Due Diligence Information Request',
    lastEdited: '1 week ago',
    status: 'active'
  },
  {
    id: '3',
    name: 'Meeting Follow-up',
    subject: 'SCVentures - Follow-up from our meeting',
    lastEdited: '3 days ago',
    status: 'active'
  },
  {
    id: '4',
    name: 'Investment Offer',
    subject: 'SCVentures - Investment Proposal',
    lastEdited: '2 weeks ago',
    status: 'draft'
  },
  {
    id: '5',
    name: 'Rejection Notice',
    subject: 'SCVentures - Application Update',
    lastEdited: '1 month ago',
    status: 'active'
  }
];

const Emails = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Email Templates</h1>
          <p className="text-muted-foreground">Manage your email templates for automated communications</p>
        </div>
        <Button className="flex items-center gap-2">
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
          <div className="space-y-4">
            {emailTemplates.map(template => (
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
                        <p className="text-xs">Last edited: {template.lastEdited}</p>
                        
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Preview</Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground ml-auto">
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
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <div className="space-y-4">
            {emailTemplates
              .filter(template => template.status === 'active')
              .map(template => (
                <Card key={template.id} className="overflow-hidden">
                  <div className="flex items-stretch">
                    <div className="bg-muted p-4 flex items-center justify-center">
                      <Mail className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge>active</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{template.subject}</p>
                          <p className="text-xs">Last edited: {template.lastEdited}</p>
                          
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Preview</Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground ml-auto">
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
        </TabsContent>
        
        <TabsContent value="draft" className="mt-0">
          <div className="space-y-4">
            {emailTemplates
              .filter(template => template.status === 'draft')
              .map(template => (
                <Card key={template.id} className="overflow-hidden">
                  <div className="flex items-stretch">
                    <div className="bg-muted p-4 flex items-center justify-center">
                      <Mail className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant="outline">draft</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{template.subject}</p>
                          <p className="text-xs">Last edited: {template.lastEdited}</p>
                          
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Preview</Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground ml-auto">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Emails;
