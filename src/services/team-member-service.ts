
import { supabase } from './base-service';
import { handleError } from './base-service';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string | null;
  initials: string;
  assigned_startups: number;
  permissions: string;
  created_at?: string;
  updated_at?: string;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleError(error, 'Failed to fetch team members');
    return [];
  }
}

export async function createTeamMember(teamMember: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember | null> {
  try {
    // Generate initials from name if not provided
    if (!teamMember.initials) {
      teamMember.initials = teamMember.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }

    console.log('Creating team member with data:', teamMember);

    const { data, error } = await supabase
      .from('team_members')
      .insert(teamMember)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, 'Failed to create team member');
    return null;
  }
}

export async function updateTeamMember(id: string, teamMember: Partial<TeamMember>): Promise<TeamMember | null> {
  try {
    // Generate initials from name if name is being updated and initials not provided
    if (teamMember.name && !teamMember.initials) {
      teamMember.initials = teamMember.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }

    const { data, error } = await supabase
      .from('team_members')
      .update(teamMember)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, 'Failed to update team member');
    return null;
  }
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'Failed to delete team member');
    return false;
  }
}
