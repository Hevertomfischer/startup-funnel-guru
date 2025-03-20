
import { Startup } from '@/types';

export type PortfolioKPI = {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'customer' | 'growth' | 'custom';
  unit: string;
  targetValue?: number;
  isHigherBetter: boolean; // true if higher values are better (e.g., revenue), false if lower values are better (e.g., burn rate)
};

export type KPIValue = {
  id: string;
  kpiId: string;
  startupId: string;
  value: number;
  date: Date;
  quarter: string; // e.g., "Q1 2023"
  notes?: string;
};

export type BoardMeeting = {
  id: string;
  startupId: string;
  scheduledDate: Date;
  actualDate?: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  title: string;
  agenda?: string;
  minutes?: string;
  attendees: string[]; // Array of team member IDs
  decisions?: string[];
  actionItems: BoardMeetingActionItem[];
  attachments?: BoardMeetingAttachment[];
};

export type BoardMeetingActionItem = {
  id: string;
  meetingId: string;
  description: string;
  assignedTo: string; // team member ID
  dueDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
  completion?: number; // Percentage of completion (0-100)
};

export type BoardMeetingAttachment = {
  id: string;
  meetingId: string;
  name: string;
  url: string;
  uploadedAt: Date;
  type: string;
};

export type StartupHighlight = {
  id: string;
  startupId: string;
  type: 'achievement' | 'concern' | 'need';
  title: string;
  description: string;
  date: Date;
  status: 'active' | 'resolved' | 'archived';
  priority?: 'low' | 'medium' | 'high';
  relatedKPIs?: string[]; // Array of KPI IDs
};

export type QuarterlyReport = {
  id: string;
  startupId: string;
  quarter: string; // e.g., "Q1 2023"
  startDate: Date;
  endDate: Date;
  kpiValues: KPIValue[];
  highlights: StartupHighlight[];
  summary?: string;
  goals?: string[];
  status: 'draft' | 'published';
};

export type PortfolioSummary = {
  totalInvested: number;
  startupCount: number;
  sectorsDistribution: Record<string, number>; // e.g., { "Fintech": 3, "Healthtech": 2 }
  stageDistribution: Record<string, number>; // e.g., { "Seed": 2, "Series A": 3 }
  performanceByQuarter: Record<string, number>; // e.g., { "Q1 2023": 10.5, "Q2 2023": 12.3 }
};

export interface InvestedStartup extends Startup {
  kpis?: PortfolioKPI[];
  kpiValues?: KPIValue[];
  highlights?: StartupHighlight[];
  boardMeetings?: BoardMeeting[];
  quarterlyReports?: QuarterlyReport[];
}
