
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Task } from '@/types';
import { useTeamMembersQuery } from '@/hooks/use-team-members';
import { useStartupData } from '@/hooks/use-startup-data';
import TaskCard from '@/components/tasks/TaskCard';
import TaskEmptyState from '@/components/tasks/TaskEmptyState';
import TaskForm, { TaskFormValues } from '@/components/tasks/TaskForm';
import TaskFilter from '@/components/tasks/TaskFilter';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { data: teamMembers = [] } = useTeamMembersQuery();
  const { formattedStartups } = useStartupData();
  
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
    // Handle "none" value for related startup
    const relatedStartupId = data.relatedStartupId === "none" ? undefined : data.relatedStartupId;
    
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: data.title,
      description: data.description,
      assignedTo: data.assignedTo,
      priority: data.priority,
      status: 'pending',
      relatedStartupId: relatedStartupId,
      createdAt: new Date(),
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('workflowTasks', JSON.stringify(updatedTasks));
    toast.success('New task created successfully');
    setIsCreateDialogOpen(false);
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

  // Convert formattedStartups to the format expected by TaskForm
  const formattedStartupsForForm = formattedStartups.map(startup => ({
    id: startup.id,
    values: {
      Startup: startup.values.Startup || 'Unnamed Startup'
    }
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-muted-foreground">Manage and track your tasks</p>
        </div>
        <div className="flex items-center gap-4">
          <TaskFilter value={filterStatus} onChange={(value) => setFilterStatus(value)} />
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <TaskEmptyState 
          hasNoTasks={tasks.length === 0} 
          onResetFilter={() => setFilterStatus('all')} 
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              getTeamMemberName={getTeamMemberName}
              getStartupName={getStartupName}
              onUpdateStatus={handleUpdateStatus}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <TaskForm
            onSubmit={createTask}
            onCancel={() => setIsCreateDialogOpen(false)}
            teamMembers={teamMembers}
            startups={formattedStartupsForForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
