
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  assignedTo?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  relatedStartupId?: string;
  createdAt: Date;
}
