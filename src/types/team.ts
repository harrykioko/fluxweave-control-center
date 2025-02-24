
export type TeamRole = 'owner' | 'admin' | 'member';

export interface BaseEntity {
  id: string;
  created_at?: string;
}

export interface Team extends BaseEntity {
  name: string;
  description: string | null;
  created_by: string;
}

export interface TeamMember extends BaseEntity {
  team_id: string;
  user_id: string;
  role: TeamRole;
}

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
