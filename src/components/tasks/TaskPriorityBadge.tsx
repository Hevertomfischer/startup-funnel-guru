
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TaskPriorityBadgeProps {
  priority: string;
}

const TaskPriorityBadge = ({ priority }: TaskPriorityBadgeProps) => {
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

export default TaskPriorityBadge;
