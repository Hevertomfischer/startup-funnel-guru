
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WorkflowRule, WorkflowCondition, WorkflowAction, Status } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash, PlusCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useTeamMembersQuery } from '@/hooks/use-team-members';

const formSchema = z.object({
  name: z.string().min(1, 'Rule name is required'),
  active: z.boolean().default(false),
});

type WorkflowRuleFormProps = {
  rule?: WorkflowRule;
  onSave: (rule: WorkflowRule) => void;
  onCancel: () => void;
  statuses: Status[];
};

const FIELD_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'problem_solved', label: 'Problem Solved' },
  { value: 'business_model', label: 'Business Model' },
  { value: 'sector', label: 'Sector' },
  { value: 'mrr', label: 'MRR' },
  { value: 'statusId', label: 'Status' },
  { value: 'priority', label: 'Priority' },
];

const OPERATOR_OPTIONS = [
  { value: 'equals', label: 'equals' },
  { value: 'notEquals', label: 'does not equal' },
  { value: 'contains', label: 'contains' },
  { value: 'greaterThan', label: 'is greater than' },
  { value: 'lessThan', label: 'is less than' },
  { value: 'changed', label: 'has changed' },
];

const ACTION_TYPES = [
  { value: 'updateField', label: 'Update Field' },
  { value: 'sendEmail', label: 'Send Email' },
  { value: 'createNotification', label: 'Create Notification' },
  { value: 'createTask', label: 'Create Task' },
];

const WorkflowRuleForm: React.FC<WorkflowRuleFormProps> = ({ rule, onSave, onCancel, statuses }) => {
  const [conditions, setConditions] = useState<WorkflowCondition[]>(
    rule?.conditions || [{ fieldId: 'name', operator: 'equals', value: '' }]
  );
  
  const [actions, setActions] = useState<WorkflowAction[]>(
    rule?.actions || [{ type: 'createNotification', config: { message: '' } }]
  );

  const { data: teamMembers = [] } = useTeamMembersQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: rule?.name || '',
      active: rule?.active || false,
    },
  });

  const addCondition = () => {
    setConditions([...conditions, { fieldId: 'name', operator: 'equals', value: '' }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, field: keyof WorkflowCondition, value: any) => {
    const updatedConditions = [...conditions];
    updatedConditions[index] = { ...updatedConditions[index], [field]: value };
    setConditions(updatedConditions);
  };

  const addAction = () => {
    setActions([...actions, { type: 'createNotification', config: { message: '' } }]);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const updateAction = (index: number, updates: Partial<WorkflowAction>) => {
    const updatedActions = [...actions];
    updatedActions[index] = { ...updatedActions[index], ...updates };
    setActions(updatedActions);
  };

  const updateActionConfig = (index: number, key: string, value: any) => {
    const updatedActions = [...actions];
    updatedActions[index].config = { ...updatedActions[index].config, [key]: value };
    setActions(updatedActions);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Validate that we have at least one condition and one action
    if (conditions.length === 0 || actions.length === 0) {
      alert('At least one condition and one action are required');
      return;
    }

    const newRule: WorkflowRule = {
      id: rule?.id || `${Date.now()}`,
      name: values.name,
      conditions,
      actions,
      active: values.active,
    };

    onSave(newRule);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rule Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Move to Due Diligence" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Active</FormLabel>
              <FormDescription className="ml-auto">
                Rules must be activated to run automatically
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Conditions (When)</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addCondition}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-3 w-3" />
              Add Condition
            </Button>
          </div>
          
          {conditions.map((condition, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-3">
                <Select
                  value={condition.fieldId}
                  onValueChange={(value) => updateCondition(index, 'fieldId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-3">
                <Select
                  value={condition.operator}
                  onValueChange={(value) => updateCondition(index, 'operator', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATOR_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-5">
                {condition.operator !== 'changed' && (
                  condition.fieldId === 'statusId' ? (
                    <Select
                      value={condition.value}
                      onValueChange={(value) => updateCondition(index, 'value', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(status => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : condition.fieldId === 'priority' ? (
                    <Select
                      value={condition.value}
                      onValueChange={(value) => updateCondition(index, 'value', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={condition.fieldId === 'mrr' ? 'number' : 'text'}
                      value={condition.value !== null ? condition.value : ''}
                      onChange={(e) => updateCondition(index, 'value', e.target.value)}
                      placeholder="Value"
                    />
                  )
                )}
              </div>
              
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCondition(index)}
                  disabled={conditions.length === 1}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Actions (Then Do)</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addAction}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-3 w-3" />
              Add Action
            </Button>
          </div>
          
          {actions.map((action, index) => (
            <div key={index} className="space-y-3 p-3 border rounded-md">
              <div className="flex justify-between items-center">
                <Select
                  value={action.type}
                  onValueChange={(value) => updateAction(index, { 
                    type: value as WorkflowAction['type'],
                    config: action.config 
                  })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTION_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAction(index)}
                  disabled={actions.length === 1}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              
              {action.type === 'updateField' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FormLabel>Field</FormLabel>
                    <Select
                      value={action.config.fieldId || ''}
                      onValueChange={(value) => updateActionConfig(index, 'fieldId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_OPTIONS.filter(f => f.value !== 'statusId').map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                        {/* Add special case for status */}
                        <SelectItem value="statusId">Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <FormLabel>New Value</FormLabel>
                    {action.config.fieldId === 'statusId' ? (
                      <Select
                        value={action.config.value || ''}
                        onValueChange={(value) => updateActionConfig(index, 'value', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map(status => (
                            <SelectItem key={status.id} value={status.id}>
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : action.config.fieldId === 'priority' ? (
                      <Select
                        value={action.config.value || ''}
                        onValueChange={(value) => updateActionConfig(index, 'value', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        type={action.config.fieldId === 'mrr' ? 'number' : 'text'}
                        value={action.config.value || ''}
                        onChange={(e) => updateActionConfig(index, 'value', e.target.value)}
                        placeholder="New value"
                      />
                    )}
                  </div>
                </div>
              )}
              
              {action.type === 'sendEmail' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FormLabel>Email Template</FormLabel>
                    <Select
                      value={action.config.emailTemplate || ''}
                      onValueChange={(value) => updateActionConfig(index, 'emailTemplate', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="status-change">Status Change</SelectItem>
                        <SelectItem value="due-diligence">Due Diligence</SelectItem>
                        <SelectItem value="welcome">Welcome</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <FormLabel>Email To</FormLabel>
                    <Select
                      value={action.config.emailTo || ''}
                      onValueChange={(value) => updateActionConfig(index, 'emailTo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Send to" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CEO">CEO</SelectItem>
                        <SelectItem value="Founder">Founder</SelectItem>
                        <SelectItem value="Team">Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {action.type === 'createNotification' && (
                <div>
                  <FormLabel>Notification Message</FormLabel>
                  <Textarea
                    value={action.config.message || ''}
                    onChange={(e) => updateActionConfig(index, 'message', e.target.value)}
                    placeholder="Enter notification message"
                  />
                </div>
              )}

              {action.type === 'createTask' && (
                <div className="space-y-3">
                  <div>
                    <FormLabel>Task Title</FormLabel>
                    <Input
                      value={action.config.taskTitle || ''}
                      onChange={(e) => updateActionConfig(index, 'taskTitle', e.target.value)}
                      placeholder="Enter task title"
                    />
                  </div>
                  
                  <div>
                    <FormLabel>Task Description</FormLabel>
                    <Textarea
                      value={action.config.taskDescription || ''}
                      onChange={(e) => updateActionConfig(index, 'taskDescription', e.target.value)}
                      placeholder="Enter task description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FormLabel>Assign To</FormLabel>
                      <Select
                        value={action.config.assignTo || ''}
                        onValueChange={(value) => updateActionConfig(index, 'assignTo', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers.map(member => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        value={action.config.taskPriority || 'medium'}
                        onValueChange={(value) => updateActionConfig(index, 'taskPriority', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <FormLabel>Due Date</FormLabel>
                    <Input
                      type="date"
                      value={action.config.taskDueDate || ''}
                      onChange={(e) => updateActionConfig(index, 'taskDueDate', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Rule</Button>
        </div>
      </form>
    </Form>
  );
};

export default WorkflowRuleForm;
