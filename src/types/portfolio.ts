
import { Startup } from './startup';
import { Status } from './status';
import { Task } from './task';

export interface PortfolioKPI {
  id: string;
  name: string;
  description?: string;
  category: 'financial' | 'operational' | 'customer' | 'other';
  unit: string;
  targetValue?: number;
  isHigherBetter: boolean;
}

export interface KPIValue {
  id: string;
  kpiId: string;
  startupId: string;
  value: number;
  date: Date;
  quarter: string;
}

export interface BoardMeeting {
  id: string;
  startupId: string;
  title: string;
  scheduledDate: Date;
  actualDate?: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  agenda?: string;
  minutes?: string;
  decisions?: string[];
  attendees: string[];
  actionItems: BoardMeetingAction[];
}

export interface BoardMeetingAction {
  id: string;
  meetingId: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'in_progress' | 'blocked';
  completion: number;
}

export interface StartupHighlight {
  id: string;
  startupId: string;
  type: 'achievement' | 'concern' | 'need';
  title: string;
  description: string;
  date: Date;
  status: 'active' | 'archived';
  priority: 'low' | 'medium' | 'high';
}

export interface QuarterlyReport {
  id: string;
  startupId: string;
  quarter: string;
  startDate: Date;
  endDate: Date;
  kpiValues: string[];
  highlights: string[];
  summary: string;
  goals: string[];
  status: 'draft' | 'published';
}

export interface PortfolioSummary {
  totalInvested: number;
  startupCount: number;
  sectorsDistribution: Record<string, number>;
  stageDistribution: Record<string, number>;
  performanceByQuarter: Record<string, number>;
}

export interface InvestedStartup extends Startup {
  kpiValues?: KPIValue[];
  boardMeetings?: BoardMeeting[];
  highlights?: StartupHighlight[];
  quarterlyReports?: QuarterlyReport[];
}
