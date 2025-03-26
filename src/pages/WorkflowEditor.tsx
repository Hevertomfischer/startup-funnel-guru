
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WorkflowRule } from '@/types';
import { Plus, Copy, AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useWorkflowRules } from '@/hooks/use-workflow-rules';
import { useToast } from '@/hooks/use-toast';
import { useStatusesQuery } from '@/hooks/use-supabase-query';
import { useTeamMembersQuery } from '@/hooks/use-team-members';
import WorkflowRuleForm from '@/components/workflow/WorkflowRuleForm';
import WorkflowDebugPanel from '@/components/workflow/WorkflowDebugPanel';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { debugWorkflowRules } from '@/hooks/workflow/workflow-utils';

const WorkflowEditor = () => {
  const { rules, saveRules, tasks } = useWorkflowRules();
  const { toast } = useToast();
  const { data: statuses = [] } = useStatusesQuery();
  const { data: teamMembers = [] } = useTeamMembersQuery();
  
  const [editingRule, setEditingRule] = useState<WorkflowRule | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  
  // Debug rules on initial load
  useEffect(() => {
    console.log('WorkflowEditor loaded, printing rule debug info:');
    debugWorkflowRules();
  }, []);
  
  const toggleRuleActive = (ruleId: string) => {
    const updatedRules = rules.map(rule => 
      rule.id === ruleId ? { ...rule, active: !rule.active } : rule
    );
    saveRules(updatedRules);
    
    const rule = rules.find(r => r.id === ruleId);
    toast({
      title: rule?.active ? "Workflow Rule Disabled" : "Workflow Rule Enabled",
      description: `"${rule?.name}" has been ${rule?.active ? "disabled" : "enabled"}.`,
    });
  };

  const duplicateRule = (ruleId: string) => {
    const ruleToDuplicate = rules.find(rule => rule.id === ruleId);
    if (ruleToDuplicate) {
      const newRule: WorkflowRule = {
        ...JSON.parse(JSON.stringify(ruleToDuplicate)),
        id: `${Date.now()}`, // Simple ID generation
        name: `${ruleToDuplicate.name} (Copy)`,
        active: false // Disable by default for safety
      };
      
      const updatedRules = [...rules, newRule];
      saveRules(updatedRules);
      
      toast({
        title: "Rule Duplicated",
        description: `"${ruleToDuplicate.name}" has been duplicated.`,
      });
    }
  };

  const deleteRule = (ruleId: string) => {
    const ruleToDelete = rules.find(rule => rule.id === ruleId);
    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    saveRules(updatedRules);
    
    toast({
      title: "Rule Deleted",
      description: `"${ruleToDelete?.name}" has been deleted.`,
      variant: "destructive"
    });
  };

  const handleEditRule = (rule: WorkflowRule) => {
    setEditingRule(rule);
    setIsCreating(false);
    setFormOpen(true);
  };

  const handleCreateRule = () => {
    setEditingRule(undefined);
    setIsCreating(true);
    setFormOpen(true);
  };

  const handleSaveRule = (rule: WorkflowRule) => {
    if (isCreating) {
      saveRules([...rules, rule]);
      toast({
        title: "Rule Created",
        description: `"${rule.name}" has been created.`,
      });
    } else {
      const updatedRules = rules.map(r => r.id === rule.id ? rule : r);
      saveRules(updatedRules);
      toast({
        title: "Rule Updated",
        description: `"${rule.name}" has been updated.`,
      });
    }
    setFormOpen(false);
    
    // Debug rules after save
    setTimeout(() => {
      debugWorkflowRules();
    }, 500);
  };

  const getOperatorLabel = (operator: string): string => {
    const operatorMap: { [key: string]: string } = {
      'equals': 'is equal to',
      'notEquals': 'is not equal to',
      'contains': 'contains',
      'greaterThan': 'is greater than',
      'lessThan': 'is less than',
      'changed': 'has changed'
    };
    return operatorMap[operator] || operator;
  };

  const getTeamMemberName = (id?: string) => {
    if (!id) return '';
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : '';
  };

  const getActionLabel = (action: any): string => {
    switch (action.type) {
      case 'updateField':
        return `Update field "${action.config.fieldId}" to "${action.config.value}"`;
      case 'sendEmail':
        return `Send email using "${action.config.emailTemplate}" template to ${action.config.emailTo}`;
      case 'createNotification':
        return `Create notification: "${action.config.message}"`;
      case 'createTask':
        return `Create task "${action.config.taskTitle}" assigned to ${getTeamMemberName(action.config.assignTo)}`;
      default:
        return 'Unknown action';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Workflow Rules</h1>
          <p className="text-muted-foreground">Automate your processes with custom triggers and actions</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleCreateRule}>
          <Plus className="h-4 w-4" />
          New Rule
        </Button>
      </div>
      
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4 flex gap-4 items-center">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm text-amber-800">
              Workflow rules run automatically when conditions are met. Test rules thoroughly before enabling them.
            </p>
            <p className="text-sm text-amber-800 mt-1">
              Task creation will assign tasks to team members when conditions are met. View and manage tasks in the Tasks page.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Add the debug panel */}
      <WorkflowDebugPanel />
      
      <div className="space-y-4">
        {rules.length === 0 ? (
          <Card className="p-8 flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-4">No workflow rules have been created yet</p>
            <Button onClick={handleCreateRule}>Create your first rule</Button>
          </Card>
        ) : (
          rules.map(rule => (
            <Card key={rule.id} className="overflow-hidden">
              <div className="flex border-b">
                <div className="py-4 px-6 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-lg">{rule.name}</h3>
                    <Badge variant={rule.active ? "default" : "outline"}>
                      {rule.active ? "Active" : "Inactive"}
                    </Badge>
                    {rule.actions.some(action => action.type === 'createTask') && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                        Creates Tasks
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="border-l flex items-center px-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`activate-${rule.id}`} className="text-sm">Active</Label>
                    <Switch 
                      id={`activate-${rule.id}`}
                      checked={rule.active}
                      onCheckedChange={() => toggleRuleActive(rule.id)}
                    />
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">When these conditions are met:</h4>
                    <ul className="space-y-2 ml-5 list-disc text-sm">
                      {rule.conditions.map((condition, index) => (
                        <li key={index}>
                          Field <span className="font-medium">{condition.fieldId}</span> {getOperatorLabel(condition.operator)} {condition.value !== null ? <span className="font-medium">{condition.value}</span> : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Perform these actions:</h4>
                    <ul className="space-y-2 ml-5 list-disc text-sm">
                      {rule.actions.map((action, index) => (
                        <li key={index}>
                          {getActionLabel(action)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditRule(rule)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => duplicateRule(rule.id)}
                    >
                      <Copy className="h-3 w-3" />
                      Duplicate
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive ml-auto"
                      onClick={() => deleteRule(rule.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Create Workflow Rule' : 'Edit Workflow Rule'}</DialogTitle>
          </DialogHeader>
          
          <WorkflowRuleForm
            rule={editingRule}
            onSave={handleSaveRule}
            onCancel={() => setFormOpen(false)}
            statuses={statuses}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowEditor;
