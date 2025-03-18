
import { useQuery } from '@tanstack/react-query';
import {
  getStartupAttachments,
  getStartupFields,
  getStartupHistory,
  getStartupStatusHistory,
  getTimeInEachColumn
} from '@/services';

// Startup related data queries
export const useStartupAttachmentsQuery = (startupId?: string) => {
  return useQuery({
    queryKey: ['startup', startupId, 'attachments'],
    queryFn: () => getStartupAttachments(startupId!),
    enabled: !!startupId
  });
};

export const useStartupFieldsQuery = (startupId?: string) => {
  return useQuery({
    queryKey: ['startup', startupId, 'fields'],
    queryFn: () => getStartupFields(startupId!),
    enabled: !!startupId
  });
};

// Startup history queries
export const useStartupHistoryQuery = (startupId?: string) => {
  return useQuery({
    queryKey: ['startup', startupId, 'history'],
    queryFn: () => getStartupHistory(startupId!),
    enabled: !!startupId
  });
};

export const useStartupStatusHistoryQuery = (startupId?: string) => {
  return useQuery({
    queryKey: ['startup', startupId, 'status-history'],
    queryFn: () => getStartupStatusHistory(startupId!),
    enabled: !!startupId
  });
};

export const useTimeInColumnsQuery = (startupId?: string) => {
  return useQuery({
    queryKey: ['startup', startupId, 'time-in-columns'],
    queryFn: () => getTimeInEachColumn(startupId!),
    enabled: !!startupId
  });
};
