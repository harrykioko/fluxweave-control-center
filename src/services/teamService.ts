
import { supabase } from "@/integrations/supabase/client";
import { Team, TeamMember, TeamRole } from "@/types/team";

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
  return data;
}

export async function addNewTeamMember(teamId: string, email: string, role: TeamRole): Promise<void> {
  // First, find the user by email
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("email", email)
    .maybeSingle();

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

