
import { supabase } from "@/integrations/supabase/client";
import { Team, TeamMember, TeamRole } from "@/types/team";

// Define specific types for database responses
interface TeamMemberResponse {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  created_at?: string;
}

interface ProfileResponse {
  id: string;
  email: string | null;
}

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
    .eq("team_id", teamId);

  if (error) throw error;
  return data as TeamMember[];
}

export async function addNewTeamMember(teamId: string, email: string, role: TeamRole): Promise<void> {
  // First, find the user by email
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single() as { data: ProfileResponse | null; error: any };

  if (profileError) throw profileError;
  if (!userProfile) throw new Error("User not found");

  // Then add the user to the team
  const { error: memberError } = await supabase
    .from("team_members")
    .insert([{
      team_id: teamId,
      user_id: userProfile.id,
      role
    }]);

  if (memberError) throw memberError;
}
