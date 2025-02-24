
import { supabase } from "@/integrations/supabase/client";
import { Team, TeamMember, TeamRole } from "@/types/team";
import { isValidTeamRole } from "@/utils/teamUtils";

export const fetchTeams = async (): Promise<Team[]> => {
  const { data, error } = await supabase
    .from("teams")
    .select("id, name, description, created_at, created_by");

  if (error) throw error;
  return data || [];
};

export const createNewTeam = async (name: string, description?: string): Promise<Team> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");

  const { data, error } = await supabase
    .from("teams")
    .insert({
      name,
      description,
      created_by: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const fetchTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from("team_members")
    .select("id, user_id, role, created_at, team_id")
    .eq('team_id', teamId);

  if (error) throw error;
  
  return (data || []).map(member => ({
    ...member,
    role: isValidTeamRole(member.role) ? member.role : 'member'
  }));
};

export const addNewTeamMember = async (teamId: string, email: string, role: TeamRole): Promise<void> => {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();
    
  if (profileError) throw profileError;
  if (!profile) throw new Error("User not found");

  const { error: insertError } = await supabase
    .from("team_members")
    .insert({
      team_id: teamId,
      user_id: profile.id,
      role
    });

  if (insertError) throw insertError;
};
