
import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Task } from '@/types';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';

interface TaskCardProps {
  task: Task;
  getTeamMemberName: (id?: string) => string;
  getStartupName: (id?: string) => string | null;
  onUpdateStatus: (taskId: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskCard = ({ 
  task, 
  getTeamMemberName, 
  getStartupName, 
  onUpdateStatus, 
  onDeleteTask 
}: TaskCardProps) => {
  return (
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
              onClick={() => onUpdateStatus(task.id, 'pending')}
            >
              Pending
            </Button>
            <Button 
              size="sm" 
              variant={task.status === 'in_progress' ? 'default' : 'outline'} 
              onClick={() => onUpdateStatus(task.id, 'in_progress')}
            >
              In Progress
            </Button>
            <Button 
              size="sm" 
              variant={task.status === 'completed' ? 'default' : 'outline'} 
              onClick={() => onUpdateStatus(task.id, 'completed')}
            >
              Completed
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => onDeleteTask(task.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
