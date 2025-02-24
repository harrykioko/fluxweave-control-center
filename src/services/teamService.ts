
import { supabase } from "@/integrations/supabase/client";
import { Team, TeamMember, TeamRole, RawTeamMember } from "@/types/team";
import { isValidTeamRole } from "@/utils/teamUtils";

// Custom error class for team-related errors
export class TeamServiceError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'TeamServiceError';
  }
}

export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const { data, error } = await supabase
      .from("teams")
      .select("id, name, description, created_at, created_by");

    if (error) throw new TeamServiceError("Failed to fetch teams", error);
    return data || [];
  } catch (error) {
    console.error("[TeamService] fetchTeams error:", error);
    throw error instanceof TeamServiceError ? error : new TeamServiceError("Unexpected error fetching teams", error);
  }
};

export const createNewTeam = async (name: string, description?: string): Promise<Team> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new TeamServiceError("No authenticated user");

    const { data, error } = await supabase
      .from("teams")
      .insert({
        name,
        description,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw new TeamServiceError("Failed to create team", error);
    if (!data) throw new TeamServiceError("No data returned after team creation");
    
    return data;
  } catch (error) {
    console.error("[TeamService] createNewTeam error:", error);
    throw error instanceof TeamServiceError ? error : new TeamServiceError("Unexpected error creating team", error);
  }
};

function convertTeamMember(rawMember: RawTeamMember): TeamMember {
  return {
    id: rawMember.id,
    team_id: rawMember.team_id,
    user_id: rawMember.user_id,
    role: isValidTeamRole(rawMember.role) ? rawMember.role : 'member',
    created_at: rawMember.created_at,
  };
}

export const fetchTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  try {
    const { data, error } = await supabase
      .from("team_members")
      .select("id, team_id, user_id, role, created_at")
      .eq("team_id", teamId);

    if (error) throw new TeamServiceError("Failed to fetch team members", error);
    if (!data) return [];
    
    return data.map(rawMember => convertTeamMember(rawMember));
  } catch (error) {
    console.error("[TeamService] fetchTeamMembers error:", error);
    throw error instanceof TeamServiceError ? error : new TeamServiceError("Unexpected error fetching team members", error);
  }
};

export const addNewTeamMember = async (teamId: string, email: string, role: TeamRole): Promise<void> => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
      
    if (profileError) throw new TeamServiceError("Failed to find user profile", profileError);
    if (!profile) throw new TeamServiceError("User not found");

    const { error: insertError } = await supabase
      .from("team_members")
      .insert({
        team_id: teamId,
        user_id: profile.id,
        role: role
      });

    if (insertError) throw new TeamServiceError("Failed to add team member", insertError);
  } catch (error) {
    console.error("[TeamService] addNewTeamMember error:", error);
    throw error instanceof TeamServiceError ? error : new TeamServiceError("Unexpected error adding team member", error);
  }
};
