
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task, Startup } from '@/types';
import { format } from 'date-fns';
import { useTeamMembersQuery } from '@/hooks/use-team-members';
import { PlusCircle, Clipboard, CheckCircle2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useStartupData } from '@/hooks/use-startup-data';

const TaskStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending</Badge>;
    case 'in_progress':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">In Progress</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Completed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const TaskPriorityBadge = ({ priority }: { priority: string }) => {
  switch (priority) {
    case 'low':
      return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-300">Low</Badge>;
    case 'medium':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Medium</Badge>;
    case 'high':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">High</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

interface TaskFormValues {
  title: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  relatedStartupId?: string;
  dueDate?: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { data: teamMembers = [] } = useTeamMembersQuery();
  const { formattedStartups } = useStartupData();
  
  const form = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      relatedStartupId: '',
      dueDate: ''
    }
  });

  useEffect(() => {
    const storedTasks = localStorage.getItem('workflowTasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        const formattedTasks = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
        setTasks(formattedTasks);
      } catch (e) {
        console.error('Error parsing tasks:', e);
        setTasks([]);
      }
    }
  }, []);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === filterStatus));
    }
  }, [tasks, filterStatus]);

  const handleUpdateStatus = (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('workflowTasks', JSON.stringify(updatedTasks));
    
    if (newStatus === 'completed') {
      toast.success('Task marked as completed');
    } else {
      toast.info(`Task status updated to ${newStatus.replace('_', ' ')}`);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('workflowTasks', JSON.stringify(updatedTasks));
    toast.success('Task deleted successfully');
  };

  const createTask = (data: TaskFormValues) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: data.title,
      description: data.description,
      assignedTo: data.assignedTo,
      priority: data.priority,
      status: 'pending',
      relatedStartupId: data.relatedStartupId || undefined,
      createdAt: new Date(),
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('workflowTasks', JSON.stringify(updatedTasks));
    toast.success('New task created successfully');
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const getTeamMemberName = (id?: string) => {
    if (!id) return 'Unassigned';
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : 'Unknown';
  };

  const getStartupName = (id?: string) => {
    if (!id) return null;
    const startup = formattedStartups.find(s => s.id === id);
    return startup ? (startup.values.Startup || 'Unnamed Startup') : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-muted-foreground">Manage and track your tasks</p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={filterStatus}
            onValueChange={value => setFilterStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Clipboard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {tasks.length === 0 
                ? "No tasks have been created yet. Create your first task to get started."
                : "No tasks match your current filter."}
            </p>
            {tasks.length > 0 && filterStatus !== 'all' && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setFilterStatus('all')}
              >
                Show All Tasks
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <Card key={task.id} className="overflow-hidden">
              <div 
                className="h-1"
                style={{ 
                  backgroundColor: 
                    task.priority === 'high' ? '#ef4444' : 
                    task.priority === 'medium' ? '#3b82f6' : 
                    '#64748b'
                }}
              />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      {task.title}
                      {task.status === 'completed' && (
                        <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      Assigned to: {getTeamMemberName(task.assignedTo)}
                      {task.relatedStartupId && (
                        <span className="ml-2">• Related to: {getStartupName(task.relatedStartupId)}</span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <TaskPriorityBadge priority={task.priority} />
                    <TaskStatusBadge status={task.status} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="mb-4">
                  <p className="text-sm">{task.description || 'No description provided'}</p>
                </div>
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div>
                    Created: {format(task.createdAt, 'MMM d, yyyy')}
                    {task.dueDate && (
                      <span className="ml-4">
                        Due: {format(task.dueDate, 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant={task.status === 'pending' ? 'default' : 'outline'} 
                      onClick={() => handleUpdateStatus(task.id, 'pending')}
                    >
                      Pending
                    </Button>
                    <Button 
                      size="sm" 
                      variant={task.status === 'in_progress' ? 'default' : 'outline'} 
                      onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                    >
                      In Progress
                    </Button>
                    <Button 
                      size="sm" 
                      variant={task.status === 'completed' ? 'default' : 'outline'} 
                      onClick={() => handleUpdateStatus(task.id, 'completed')}
                    >
                      Completed
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(createTask)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter task description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teamMembers.map(member => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="relatedStartupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Related Startup</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select startup (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {formattedStartups.map(startup => (
                            <SelectItem key={startup.id} value={startup.id}>
                              {startup.values.Startup || 'Unnamed Startup'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Task</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
