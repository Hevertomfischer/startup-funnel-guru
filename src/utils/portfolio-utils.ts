
import { Startup } from '@/types';

// Function to determine if a startup is invested based on its status
export const isInvestedStartup = (startup: Startup, investedStatusIds: string[]): boolean => {
  return investedStatusIds.includes(startup.statusId);
};

// Function to get invested startups
export const getInvestedStartups = (startups: Startup[], investedStatusIds: string[]): Startup[] => {
  return startups.filter(startup => isInvestedStartup(startup, investedStatusIds));
};

// Save invested status IDs to localStorage
export const saveInvestedStatusIds = (statusIds: string[]): void => {
  localStorage.setItem('investedStatusIds', JSON.stringify(statusIds));
};

// Get invested status IDs from localStorage
export const getInvestedStatusIds = (): string[] => {
  const savedIds = localStorage.getItem('investedStatusIds');
  return savedIds ? JSON.parse(savedIds) : [];
};
