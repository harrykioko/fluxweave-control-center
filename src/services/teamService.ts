
import { supabase } from "@/integrations/supabase/client";
import { Team, TeamMember, TeamRole } from "@/types/team";
import { RawTeam, RawTeamMember } from "@/types/supabaseTypes";
import { isValidTeamRole } from "@/utils/teamUtils";

export class TeamServiceError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'TeamServiceError';
  }
}

const mapDbTeamToDomain = (dbTeam: RawTeam): Team => ({
  id: dbTeam.id,
  name: dbTeam.name,
  description: dbTeam.description,
  created_by: dbTeam.created_by,
  created_at: dbTeam.created_at || undefined,
});

const mapDbTeamMemberToDomain = (dbMember: RawTeamMember): TeamMember => ({
  id: dbMember.id,
  team_id: dbMember.team_id,
  user_id: dbMember.user_id,
  role: isValidTeamRole(dbMember.role) ? dbMember.role : 'member',
  created_at: dbMember.created_at || undefined,
});

export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*');

    if (error) throw new TeamServiceError("Failed to fetch teams", error);
    if (!data) return [];

    return data.map(team => mapDbTeamToDomain(team));
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
      .from('teams')
      .insert({
        name,
        description,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw new TeamServiceError("Failed to create team", error);
    if (!data) throw new TeamServiceError("No data returned after team creation");
    
    return mapDbTeamToDomain(data);
  } catch (error) {
    console.error("[TeamService] createNewTeam error:", error);
    throw error instanceof TeamServiceError ? error : new TeamServiceError("Unexpected error creating team", error);
  }
};

export const fetchTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId);

    if (error) throw new TeamServiceError("Failed to fetch team members", error);
    if (!data) return [];
    
    return data.map(member => mapDbTeamMemberToDomain(member));
  } catch (error) {
    console.error("[TeamService] fetchTeamMembers error:", error);
    throw error instanceof TeamServiceError ? error : new TeamServiceError("Unexpected error fetching team members", error);
  }
};

export const addNewTeamMember = async (teamId: string, email: string, role: TeamRole): Promise<void> => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (profileError) throw new TeamServiceError("Failed to find user profile", profileError);
    if (!profile) throw new TeamServiceError("User not found");

    const { error: insertError } = await supabase
      .from('team_members')
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
