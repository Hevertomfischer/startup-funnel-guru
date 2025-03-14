import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getStatuses, 
  getLabels, 
  getStartups, 
  getStartupsByStatus,
  getStartup,
  createStartup,
  updateStartup,
  deleteStartup,
  getStartupLabels,
  getStartupAttachments,
  getStartupFields,
  updateStatusPositions
} from '@/services/supabase';

// Status queries
export const useStatusesQuery = () => {
  return useQuery({
    queryKey: ['statuses'],
    queryFn: getStatuses
  });
};

// Label queries
export const useLabelsQuery = () => {
  return useQuery({
    queryKey: ['labels'],
    queryFn: getLabels
  });
};

// Startup queries
export const useStartupsQuery = () => {
  return useQuery({
    queryKey: ['startups'],
    queryFn: getStartups
  });
};

export const useStartupsByStatusQuery = (statusId: string) => {
  return useQuery({
    queryKey: ['startups', 'status', statusId],
    queryFn: () => getStartupsByStatus(statusId),
    enabled: !!statusId
  });
};

export const useStartupQuery = (id?: string) => {
  return useQuery({
    queryKey: ['startup', id],
    queryFn: () => getStartup(id!),
    enabled: !!id
  });
};

// Startup mutations
export const useCreateStartupMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createStartup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startups'] });
    }
  });
};

export const useUpdateStartupMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, startup }: { id: string; startup: any }) => 
      updateStartup(id, startup),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      queryClient.invalidateQueries({ queryKey: ['startup', variables.id] });
    }
  });
};

export const useDeleteStartupMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteStartup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startups'] });
    }
  });
};

// Status mutations
export const useUpdateStatusPositionsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateStatusPositions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] });
    }
  });
};

// Startup related data queries
export const useStartupLabelsQuery = (startupId?: string) => {
  return useQuery({
    queryKey: ['startup', startupId, 'labels'],
    queryFn: () => getStartupLabels(startupId!),
    enabled: !!startupId
  });
};

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
