
import { StartupValues } from './startup-values';

export interface Startup {
  id: string;
  statusId: string;
  values: StartupValues;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  dueDate?: string;
  timeTracking?: number;
  priority: 'low' | 'medium' | 'high';
  labels?: string[];
  tags?: string[];
  attachments?: any[];
}
