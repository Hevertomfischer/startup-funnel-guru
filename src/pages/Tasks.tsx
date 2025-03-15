
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types';
import { format } from 'date-fns';
import { useTeamMembersQuery } from '@/hooks/use-team-members';

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

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { data: teamMembers = [] } = useTeamMembersQuery();

  useEffect(() => {
    // Load tasks from localStorage
    const storedTasks = localStorage.getItem('workflowTasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        // Convert string dates to Date objects
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

  const handleUpdateStatus = (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('workflowTasks', JSON.stringify(updatedTasks));
  };

  const getTeamMemberName = (id?: string) => {
    if (!id) return 'Unassigned';
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tasks</h1>
        <p className="text-muted-foreground">Manage workflow generated tasks</p>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No tasks have been created yet. Tasks will appear here when workflow rules create them.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <Card key={task.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription>
                      Assigned to: {getTeamMemberName(task.assignedTo)}
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
