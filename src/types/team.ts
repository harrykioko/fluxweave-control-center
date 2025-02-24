
// Database types that exactly match Supabase schema
export interface DbTeam {
  id: uuid;
  name: string;
  description: string | null;
  created_by: uuid;
  created_at: string | null;
}

export interface DbTeamMember {
  id: uuid;
  team_id: uuid;
  user_id: uuid;
  role: string;
  created_at: string | null;
}

// Define uuid type for strict typing
type uuid = string;

// Domain types used in the application
export type TeamRole = 'owner' | 'admin' | 'member';

export interface Team {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at?: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  created_at?: string;
}

// Context value type
export interface TeamContextValue {
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  teams: Team[];
  loadTeams: () => Promise<void>;
  createTeam: (name: string, description?: string) => Promise<Team>;
  teamMembers: TeamMember[];
  loadTeamMembers: (teamId: string) => Promise<void>;
  addTeamMember: (teamId: string, email: string, role: TeamRole) => Promise<void>;
}
