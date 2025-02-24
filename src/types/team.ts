
// Basic types that match exactly what's in the database
export type TeamRole = 'owner' | 'admin' | 'member';

export interface BaseEntity {
  id: string;
  created_at?: string;
}

// Matches teams table schema exactly
export interface Team extends BaseEntity {
  name: string;
  description: string | null;
  created_by: string;
}

// Extended team type that includes the addTeamMember method
export interface TeamWithMemberActions extends Team {
  addTeamMember: (email: string, role: TeamRole) => Promise<void>;
}

// Matches team_members table schema exactly
export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  created_at?: string;
}

// Context value type without circular references
export interface TeamContextValue {
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  teams: Team[];
  loadTeams: () => Promise<void>;
  createTeam: (name: string, description?: string) => Promise<TeamWithMemberActions>;
  teamMembers: TeamMember[];
  loadTeamMembers: (teamId: string) => Promise<void>;
  addTeamMember: (teamId: string, email: string, role: TeamRole) => Promise<void>;
}
