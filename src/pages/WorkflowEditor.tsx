
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WorkflowRule } from '@/types';
import { Plus, Copy, AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useWorkflowRules, saveWorkflowRules } from '@/hooks/use-workflow-rules';
import { useToast } from '@/hooks/use-toast';

const WorkflowEditor = () => {
  const { rules, setRules, saveRules } = useWorkflowRules();
  const { toast } = useToast();

  // Load rules on initialization
  useEffect(() => {
    // The hook already loads the rules
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

  const getActionLabel = (action: any): string => {
    switch (action.type) {
      case 'updateField':
        return `Update field "${action.config.fieldId}" to "${action.config.value}"`;
      case 'sendEmail':
        return `Send email using "${action.config.emailTemplate}" template to ${action.config.emailTo}`;
      case 'createNotification':
        return `Create notification: "${action.config.message}"`;
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
        <Button className="flex items-center gap-2">
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
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {rules.map(rule => (
          <Card key={rule.id} className="overflow-hidden">
            <div className="flex border-b">
              <div className="py-4 px-6 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-lg">{rule.name}</h3>
                  <Badge variant={rule.active ? "default" : "outline"}>
                    {rule.active ? "Active" : "Inactive"}
                  </Badge>
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
                  <Button variant="outline" size="sm">Edit</Button>
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
        ))}
      </div>
    </div>
  );
};

export default WorkflowEditor;
