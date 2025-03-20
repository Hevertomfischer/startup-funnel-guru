
import { 
  PortfolioKPI, 
  KPIValue, 
  BoardMeeting, 
  StartupHighlight, 
  QuarterlyReport 
} from '@/types/portfolio';

// KPIs
export const getKPIs = (): PortfolioKPI[] => {
  return JSON.parse(localStorage.getItem('portfolioKPIs') || '[]');
};

export const saveKPIs = (kpis: PortfolioKPI[]): void => {
  localStorage.setItem('portfolioKPIs', JSON.stringify(kpis));
};

// KPI Values
export const getKPIValues = (): KPIValue[] => {
  return JSON.parse(localStorage.getItem('portfolioKPIValues') || '[]');
};

export const saveKPIValues = (values: KPIValue[]): void => {
  localStorage.setItem('portfolioKPIValues', JSON.stringify(values));
};

// Board Meetings
export const getBoardMeetings = (): BoardMeeting[] => {
  return JSON.parse(localStorage.getItem('portfolioBoardMeetings') || '[]');
};

export const saveBoardMeetings = (meetings: BoardMeeting[]): void => {
  localStorage.setItem('portfolioBoardMeetings', JSON.stringify(meetings));
};

// Startup Highlights
export const getStartupHighlights = (): StartupHighlight[] => {
  return JSON.parse(localStorage.getItem('portfolioHighlights') || '[]');
};

export const saveStartupHighlights = (highlights: StartupHighlight[]): void => {
  localStorage.setItem('portfolioHighlights', JSON.stringify(highlights));
};

// Quarterly Reports
export const getQuarterlyReports = (): QuarterlyReport[] => {
  return JSON.parse(localStorage.getItem('portfolioQuarterlyReports') || '[]');
};

export const saveQuarterlyReports = (reports: QuarterlyReport[]): void => {
  localStorage.setItem('portfolioQuarterlyReports', JSON.stringify(reports));
};

// Helper functions to get data for a specific startup
export const getStartupKPIValues = (startupId: string): KPIValue[] => {
  const allValues = getKPIValues();
  return allValues.filter(value => value.startupId === startupId);
};

export const getStartupBoardMeetings = (startupId: string): BoardMeeting[] => {
  const allMeetings = getBoardMeetings();
  return allMeetings.filter(meeting => meeting.startupId === startupId);
};

export const getStartupHighlightsById = (startupId: string): StartupHighlight[] => {
  const allHighlights = getStartupHighlights();
  return allHighlights.filter(highlight => highlight.startupId === startupId);
};

export const getStartupQuarterlyReports = (startupId: string): QuarterlyReport[] => {
  const allReports = getQuarterlyReports();
  return allReports.filter(report => report.startupId === startupId);
};
