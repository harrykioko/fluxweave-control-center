
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
  email: string;
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
  return data as TeamMemberResponse[];
}

export async function addNewTeamMember(teamId: string, email: string, role: TeamRole): Promise<void> {
  // First, find the user by email
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) throw new Error("User not found");

  // Then add the user to the team
  const { error: memberError } = await supabase
    .from("team_members")
    .insert([{
      team_id: teamId,
      user_id: profile.id,
      role
    }]);

  if (memberError) throw memberError;
}
