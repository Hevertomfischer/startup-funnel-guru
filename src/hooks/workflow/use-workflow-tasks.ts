
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types';
import { getTasks, saveTasks } from './workflow-utils';
import { useTeamMembersQuery } from '../use-team-members';

export const useWorkflowTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const { data: teamMembers = [] } = useTeamMembersQuery();

  useEffect(() => {
    // Load tasks from storage
    setTasks(getTasks());
  }, []);

  // Create a new task
  const createTask = (
    title: string,
    description: string,
    assignedTo: string,
    priority: 'low' | 'medium' | 'high',
    dueDate: string | undefined,
    startupId: string
  ): Task => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      assignedTo,
      priority: priority || 'medium',
      status: 'pending',
      relatedStartupId: startupId,
      createdAt: new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined
    };

    // Add task to tasks array
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    // Find team member name for notification
    const assignedMember = teamMembers.find(member => member.id === assignedTo);

    // Show notification
    toast({
      title: "Task Created",
      description: `Task "${title}" assigned to ${assignedMember?.name || 'a team member'}`,
    });

    return newTask;
  };

  return {
    tasks,
    setTasks,
    createTask
  };
};
