
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember, TeamMember } from '@/services/team-member-service';

export const useTeamMembersQuery = () => {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: getTeamMembers
  });
};

export const useCreateTeamMemberMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    }
  });
};

export const useUpdateTeamMemberMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, teamMember }: { id: string; teamMember: Partial<TeamMember> }) => 
      updateTeamMember(id, teamMember),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    }
  });
};

export const useDeleteTeamMemberMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    }
  });
};
