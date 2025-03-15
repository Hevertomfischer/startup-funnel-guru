
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TaskStatusBadgeProps {
  status: string;
}

const TaskStatusBadge = ({ status }: TaskStatusBadgeProps) => {
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

export default TaskStatusBadge;
