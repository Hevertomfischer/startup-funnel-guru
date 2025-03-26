
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { debugWorkflowRules, clearWorkflowRules } from '@/hooks/workflow/workflow-utils';
import { AlertCircle, Trash, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WorkflowDebugPanel = () => {
  const { toast } = useToast();

  const handleDebugRules = () => {
    debugWorkflowRules();
    toast({
      title: 'Debug Info',
      description: 'Check your browser console for workflow rule debug information',
    });
  };

  const handleClearRules = () => {
    if (confirm('Are you sure you want to delete all workflow rules? This cannot be undone.')) {
      clearWorkflowRules();
      toast({
        title: 'Rules Cleared',
        description: 'All workflow rules have been deleted',
        variant: 'destructive',
      });
      // Reload the page to show the changes
      window.location.reload();
    }
  };

  return (
    <Card className="bg-blue-50 border-blue-200 mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          Workflow Debugging
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-sm text-blue-700 mb-3">
          If your workflow rules aren't working as expected, you can use these tools to debug:
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-700 border-blue-200"
            onClick={handleDebugRules}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Debug Rules
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600 border-red-200"
            onClick={handleClearRules}
          >
            <Trash className="h-3.5 w-3.5 mr-1" />
            Clear All Rules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowDebugPanel;
