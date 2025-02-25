
import { supabase } from "@/integrations/supabase/client";
import { Team, TeamMember, TeamRole } from "@/types/team";

// Define a specific type for team member response
type TeamMemberResponse = {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  created_at?: string;
};

export async function fetchTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from("teams")
    .select("*");

  if (error) throw error;
  return data;
}

export async function createNewTeam(name: string, description?: string): Promise<Team> {
  const { data, error } = await supabase
    .from("teams")
    .insert([{
      name,
      description,
      created_by: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchTeamMembers(teamId: string): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("team_id", teamId)
    .returns<TeamMemberResponse[]>();

  if (error) throw error;
  return data;
}

export async function addNewTeamMember(teamId: string, email: string, role: TeamRole): Promise<void> {
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (userError) throw userError;
  if (!userData) throw new Error("User not found");

  const { error } = await supabase
    .from("team_members")
    .insert([{
      team_id: teamId,
      user_id: userData.id,
      role
    }]);

  if (error) throw error;
}
